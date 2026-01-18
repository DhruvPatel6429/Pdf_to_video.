from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import subprocess
import uuid
from datetime import datetime

app = FastAPI(title="ML Animation Platform")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.ml_animation_db
scenes_collection = db.scenes

# Models
class Scene(BaseModel):
    scene_id: int
    concept: str
    explanation: List[str]
    equations: List[str]
    visual: str
    narration: str

class SceneUpdate(BaseModel):
    concept: Optional[str] = None
    explanation: Optional[List[str]] = None
    equations: Optional[List[str]] = None
    visual: Optional[str] = None
    narration: Optional[str] = None

class RenderRequest(BaseModel):
    scene_ids: Optional[List[int]] = None
    quality: Optional[str] = "medium"

# Startup Event
@app.on_event("startup")
async def startup_event():
    # Load existing scenes from scene_graph.json into MongoDB
    if await scenes_collection.count_documents({}) == 0:
        with open("/app/scene_graph.json", "r") as f:
            scenes = json.load(f)
            if scenes:
                await scenes_collection.insert_many(scenes)
    print("✅ Backend server started successfully")

# Health Check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ML Animation Platform"}

# Get All Scenes
@app.get("/api/scenes")
async def get_scenes():
    scenes = await scenes_collection.find({}, {"_id": 0}).to_list(100)
    return {"scenes": scenes, "total": len(scenes)}

# Get Single Scene
@app.get("/api/scenes/{scene_id}")
async def get_scene(scene_id: int):
    scene = await scenes_collection.find_one({"scene_id": scene_id}, {"_id": 0})
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    return scene

# Create Scene
@app.post("/api/scenes")
async def create_scene(scene: Scene):
    # Check if scene_id already exists
    existing = await scenes_collection.find_one({"scene_id": scene.scene_id})
    if existing:
        raise HTTPException(status_code=400, detail="Scene ID already exists")
    
    scene_dict = scene.dict()
    await scenes_collection.insert_one(scene_dict)
    
    # Update scene_graph.json
    await sync_to_json()
    
    return {"message": "Scene created successfully", "scene": scene_dict}

# Update Scene
@app.put("/api/scenes/{scene_id}")
async def update_scene(scene_id: int, scene_update: SceneUpdate):
    existing = await scenes_collection.find_one({"scene_id": scene_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    update_data = {k: v for k, v in scene_update.dict().items() if v is not None}
    
    if update_data:
        await scenes_collection.update_one(
            {"scene_id": scene_id},
            {"$set": update_data}
        )
        
        # Update scene_graph.json
        await sync_to_json()
    
    updated_scene = await scenes_collection.find_one({"scene_id": scene_id}, {"_id": 0})
    return {"message": "Scene updated successfully", "scene": updated_scene}

# Delete Scene
@app.delete("/api/scenes/{scene_id}")
async def delete_scene(scene_id: int):
    result = await scenes_collection.delete_one({"scene_id": scene_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    # Update scene_graph.json
    await sync_to_json()
    
    return {"message": "Scene deleted successfully"}

# Search Scenes
@app.get("/api/scenes/search/{query}")
async def search_scenes(query: str):
    scenes = await scenes_collection.find(
        {"$or": [
            {"concept": {"$regex": query, "$options": "i"}},
            {"narration": {"$regex": query, "$options": "i"}}
        ]},
        {"_id": 0}
    ).to_list(100)
    return {"scenes": scenes, "total": len(scenes)}

# Get Statistics
@app.get("/api/stats")
async def get_statistics():
    total_scenes = await scenes_collection.count_documents({})
    
    # Count by visual type
    visual_types = await scenes_collection.distinct("visual")
    visual_counts = {}
    for vtype in visual_types:
        count = await scenes_collection.count_documents({"visual": vtype})
        visual_counts[vtype] = count
    
    return {
        "total_scenes": total_scenes,
        "visual_types": visual_counts,
        "audio_files": len([f for f in os.listdir("/app/audio") if f.endswith(".wav")]) if os.path.exists("/app/audio") else 0
    }

# Generate Audio for Scene
@app.post("/api/generate-audio/{scene_id}")
async def generate_audio(scene_id: int, background_tasks: BackgroundTasks):
    scene = await scenes_collection.find_one({"scene_id": scene_id})
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    background_tasks.add_task(generate_audio_task, scene_id, scene.get("narration", ""))
    
    return {"message": "Audio generation started", "scene_id": scene_id}

# Render Animation
@app.post("/api/render")
async def render_animation(request: RenderRequest, background_tasks: BackgroundTasks):
    render_id = str(uuid.uuid4())
    background_tasks.add_task(render_task, render_id, request.scene_ids, request.quality)
    
    return {
        "message": "Rendering started",
        "render_id": render_id,
        "status": "processing"
    }

# List Available Videos
@app.get("/api/videos")
async def list_videos():
    video_dir = "/app/media/videos"
    if not os.path.exists(video_dir):
        return {"videos": []}
    
    videos = []
    for root, dirs, files in os.walk(video_dir):
        for file in files:
            if file.endswith(".mp4"):
                videos.append({
                    "filename": file,
                    "path": os.path.join(root, file),
                    "size": os.path.getsize(os.path.join(root, file))
                })
    
    return {"videos": videos}

# Serve Video File
@app.get("/api/video/{filename}")
async def get_video(filename: str):
    video_path = f"/app/media/videos/{filename}"
    if not os.path.exists(video_path):
        # Try searching in subdirectories
        for root, dirs, files in os.walk("/app/media/videos"):
            if filename in files:
                video_path = os.path.join(root, filename)
                break
    
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(video_path, media_type="video/mp4")

# Serve Audio File
@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    audio_path = f"/app/audio/{filename}"
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found")
    
    return FileResponse(audio_path, media_type="audio/wav")

# Helper Functions
async def sync_to_json():
    """Sync MongoDB data back to scene_graph.json"""
    scenes = await scenes_collection.find({}, {"_id": 0}).to_list(100)
    with open("/app/scene_graph.json", "w") as f:
        json.dump(scenes, f, indent=2)

def generate_audio_task(scene_id: int, narration: str):
    """Background task to generate audio"""
    try:
        import pyttsx3
        engine = pyttsx3.init()
        engine.setProperty("rate", 165)
        os.makedirs("/app/audio", exist_ok=True)
        engine.save_to_file(narration, f"/app/audio/scene_{scene_id}.wav")
        engine.runAndWait()
    except Exception as e:
        print(f"Error generating audio: {e}")

def render_task(render_id: str, scene_ids: Optional[List[int]], quality: str):
    """Background task to render animation"""
    try:
        # This would call manim rendering
        # For now, just a placeholder
        print(f"Rendering {render_id} with scenes {scene_ids} at {quality} quality")
    except Exception as e:
        print(f"Error rendering: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
