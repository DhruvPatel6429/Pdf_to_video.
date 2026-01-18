# 🚀 Quick Start Guide - ML Animation Studio

## Access Your Application

### Frontend (Web Interface)
- **URL**: http://localhost:3000
- **Features**: Dashboard, Scene Library, Scene Editor

### Backend API
- **URL**: http://localhost:8001
- **Documentation**: http://localhost:8001/docs (FastAPI auto-generated docs)

---

## 📱 How to Use the Application

### 1️⃣ View Dashboard
- Open http://localhost:3000
- See statistics: Total scenes, animations, audio files
- View visual types distribution chart
- Browse recent scenes

### 2️⃣ Browse Scene Library
- Click "Scene Library" in the sidebar
- View all 7 ML concept scenes
- Each card shows:
  - Scene number and concept name
  - Visual type
  - Description
  - Mathematical equation
  - Preview button

### 3️⃣ Search Scenes
- In Scene Library, use the search box
- Type keywords (e.g., "gradient", "neural", "loss")
- Results filter instantly
- Shows "Found X scenes" notification

### 4️⃣ Create New Scene
- Click "Create Scene" in sidebar
- Fill in the form:
  - **Scene ID**: Unique number (8, 9, 10, etc.)
  - **Concept**: Scene title (e.g., "Backpropagation")
  - **Visual Type**: Select from dropdown
    - None
    - Linear Regression
    - Loss Curve
    - Gradient Descent
    - Neural Network
  - **Narration**: Description text
- Click "Save Scene"
- Scene appears in library immediately

### 5️⃣ Edit Scene
- In Scene Library, click the edit icon (pencil) on any scene card
- Modify any fields
- Click "Save Scene"
- Changes reflect instantly

### 6️⃣ Delete Scene
- In Scene Library, click the delete icon (trash) on any scene card
- Confirm deletion
- Scene is removed from database

---

## 🔌 API Examples

### Get All Scenes
```bash
curl http://localhost:8001/api/scenes
```

### Get Statistics
```bash
curl http://localhost:8001/api/stats
```

### Search Scenes
```bash
curl http://localhost:8001/api/scenes/search/gradient
```

### Get Single Scene
```bash
curl http://localhost:8001/api/scenes/1
```

### Create Scene
```bash
curl -X POST http://localhost:8001/api/scenes \
  -H "Content-Type: application/json" \
  -d '{
    "scene_id": 11,
    "concept": "Backpropagation",
    "explanation": ["Computes gradients through chain rule"],
    "equations": ["dL/dw = dL/dy * dy/dw"],
    "visual": "neural_network",
    "narration": "Backpropagation calculates gradients for neural network training"
  }'
```

### Update Scene
```bash
curl -X PUT http://localhost:8001/api/scenes/1 \
  -H "Content-Type: application/json" \
  -d '{"concept": "Linear Regression - Updated"}'
```

### Delete Scene
```bash
curl -X DELETE http://localhost:8001/api/scenes/11
```

---

## 🛠️ Service Management

### Check Service Status
```bash
sudo supervisorctl status
```

### Restart Services
```bash
# Restart backend
sudo supervisorctl restart backend

# Restart frontend
sudo supervisorctl restart frontend

# Restart all
sudo supervisorctl restart all
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.err.log

# Frontend logs  
tail -f /var/log/supervisor/frontend.err.log
```

---

## 📂 File Locations

### Configuration Files
- Backend: `/app/backend/server.py`
- Frontend: `/app/frontend/src/App.js`
- Scene Data: `/app/scene_graph.json`
- Environment: `/app/backend/.env` and `/app/frontend/.env`

### Generated Files
- Audio: `/app/audio/scene_*.wav`
- Videos: `/app/media/videos/`

---

## 🎨 UI Features

### Dashboard
- ✅ Statistics overview
- ✅ Visual types chart
- ✅ Recent scenes preview
- ✅ "System Online" indicator

### Scene Library
- ✅ Grid layout of all scenes
- ✅ Search functionality
- ✅ Edit/delete actions per card
- ✅ Preview buttons
- ✅ Equation display
- ✅ Visual type badges

### Scene Editor
- ✅ Modal popup design
- ✅ Form validation
- ✅ Visual type dropdown
- ✅ Auto-save to database
- ✅ Responsive layout

### Design Elements
- 🎨 Purple/pink gradient background
- 🪟 Glassmorphism effects
- ✨ Smooth animations
- 🎯 Professional icons
- 📱 Fully responsive

---

## ⚡ Quick Tips

1. **Search is Fast**: Type and press Enter for instant results
2. **All Changes Save Instantly**: No need to refresh the page
3. **Scene IDs Must Be Unique**: System will warn if ID already exists
4. **Visual Types**: Choose based on the concept (e.g., neural_network for NN topics)
5. **Navigation**: Use sidebar to switch between Dashboard and Scene Library
6. **Mobile Friendly**: Works on all screen sizes

---

## 🐛 Troubleshooting

### Frontend Not Loading?
```bash
sudo supervisorctl restart frontend
# Wait 10 seconds, then check: http://localhost:3000
```

### Backend Not Responding?
```bash
sudo supervisorctl restart backend
# Test: curl http://localhost:8001/api/health
```

### Database Issues?
```bash
sudo supervisorctl restart mongodb
```

### See Error Messages
```bash
tail -n 50 /var/log/supervisor/backend.err.log
tail -n 50 /var/log/supervisor/frontend.err.log
```

---

## 🎯 Next Steps

Now that your application is running, you can:
1. ✅ Explore the existing 7 ML scenes
2. ✅ Create your own custom scenes
3. ✅ Use the search to find specific topics
4. ✅ Edit existing scenes to improve them
5. ✅ Integrate with Manim for actual rendering

---

## 📚 Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Manim**: https://www.manim.community

---

**Your ML Animation Studio is ready to use! 🎉**

Access it at: **http://localhost:3000**
