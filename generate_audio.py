import json
import pyttsx3
import os

engine = pyttsx3.init()
engine.setProperty("rate", 165)

os.makedirs("audio", exist_ok=True)

with open("scene_graph.json", "r", encoding="utf-8") as f:
    scenes = json.load(f)

for scene in scenes:
    sid = scene["scene_id"]
    narration = scene.get("narration", "")
    if narration.strip():
        engine.save_to_file(narration, f"audio/scene_{sid}.wav")

engine.runAndWait()
print("Audio narration generated successfully.")
