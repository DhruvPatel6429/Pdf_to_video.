# ML Animation Studio - Full-Stack Web Platform

A professional, modern web application for managing and creating educational Machine Learning animation scenes using Manim.

## 🎯 Project Overview

This application transforms your Manim animation project into a full-featured web platform with:
- **Backend API**: FastAPI server with MongoDB for scene management
- **Frontend UI**: React application with advanced, polished interface
- **End-to-End Integration**: Seamless connection between frontend and backend

---

## 🏗️ Architecture

### Backend (FastAPI + MongoDB)
- RESTful API for scene CRUD operations
- MongoDB database for persistent storage
- Background task processing
- Audio/video file serving
- Search and statistics endpoints

### Frontend (React + Tailwind CSS)
- Modern glassmorphism UI design
- Responsive dashboard with statistics
- Scene library with card-based layout
- Interactive scene editor
- Real-time search functionality
- Professional animations and transitions

---

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles with Tailwind
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── package.json       # Node dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── .env              # Frontend environment variables
├── auto_explainer.py      # Original Manim scene generator
├── generate_audio.py      # Audio narration generator
├── scene_graph.json       # Scene data configuration
└── audio/                 # Generated audio files
```

---

## 🚀 API Endpoints

### Health & Status
- `GET /api/health` - Health check
- `GET /api/stats` - Get statistics (total scenes, visual types, audio files)

### Scene Management
- `GET /api/scenes` - Get all scenes
- `GET /api/scenes/{scene_id}` - Get single scene
- `POST /api/scenes` - Create new scene
- `PUT /api/scenes/{scene_id}` - Update scene
- `DELETE /api/scenes/{scene_id}` - Delete scene
- `GET /api/scenes/search/{query}` - Search scenes

### Media
- `GET /api/videos` - List available videos
- `GET /api/video/{filename}` - Serve video file
- `GET /api/audio/{filename}` - Serve audio file
- `POST /api/generate-audio/{scene_id}` - Generate audio for scene
- `POST /api/render` - Render animation

---

## 🎨 Frontend Features

### Dashboard View
- **Statistics Cards**: Total scenes, animations, audio files
- **Visual Types Distribution**: Interactive chart showing scene types
- **Recent Scenes**: Quick access to latest scenes

### Scene Library
- **Grid Layout**: Beautiful card-based scene display
- **Scene Cards**: Show concept, visual type, equations, and descriptions
- **Actions**: Edit and delete buttons for each scene
- **Search**: Real-time scene search by concept or narration
- **Preview**: Preview button for each scene

### Scene Editor
- **Modal Interface**: Clean, intuitive form
- **Fields**: Scene ID, concept, visual type, narration
- **Validation**: Required field validation
- **Create/Edit**: Single interface for both operations

### UI/UX Features
- ✨ Glassmorphism design with backdrop blur
- 🎨 Gradient backgrounds (purple/indigo theme)
- 🌊 Smooth animations and transitions
- 📱 Responsive layout for all screen sizes
- 🎯 Professional icon integration (lucide-react)
- 🔔 Toast notifications for user feedback
- 🎭 Interactive hover effects
- 📊 Progress bars and visual indicators

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Tailwind CSS 3** - Utility-first CSS
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Database
- **MongoDB** - Document database

---

## 🔧 Configuration

### Backend Environment (.env)
```
MONGO_URL=mongodb://localhost:27017
```

### Frontend Environment (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
PORT=3000
```

---

## 📊 Current Data

The application is pre-loaded with 7 Machine Learning concept scenes:
1. **Linear Regression** - Models relationships between variables
2. **Loss Function** - Measures prediction error
3. **Gradient Descent** - Optimization algorithm
4. **Learning Rate** - Controls step size in training
5. **Convergence** - Reaching minimum loss
6. **Neural Network** - Layers of neurons for learning
7. **Why Non-Linearity Matters** - Importance of activation functions

Each scene includes:
- Concept name
- Detailed explanations
- Mathematical equations
- Visual type (linear_regression, loss_curve, gradient_descent, neural_network)
- Narration text
- Generated audio files

---

## 🔄 Service Management

Both frontend and backend run via Supervisor:

```bash
# Check status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart all

# View logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

---

## 🧪 Testing

### Backend API Tests
```bash
# Health check
curl http://localhost:8001/api/health

# Get all scenes
curl http://localhost:8001/api/scenes

# Get statistics
curl http://localhost:8001/api/stats

# Search scenes
curl http://localhost:8001/api/scenes/search/gradient

# Create scene (example)
curl -X POST http://localhost:8001/api/scenes \
  -H "Content-Type: application/json" \
  -d '{"scene_id": 8, "concept": "Test", ...}'

# Update scene
curl -X PUT http://localhost:8001/api/scenes/1 \
  -H "Content-Type: application/json" \
  -d '{"concept": "Updated Concept"}'
```

### Frontend Testing
- Access dashboard: `http://localhost:3000`
- Navigate to Scene Library
- Test search functionality
- Create/edit scenes via modal
- Verify all UI interactions

---

## 🎯 Key Features Implemented

### ✅ Backend
- [x] Complete REST API
- [x] MongoDB integration
- [x] CRUD operations for scenes
- [x] Search functionality
- [x] Statistics endpoint
- [x] File serving (audio/video)
- [x] Background task support
- [x] Error handling
- [x] CORS configuration

### ✅ Frontend
- [x] Dashboard with statistics
- [x] Scene library with grid layout
- [x] Search functionality
- [x] Scene editor modal
- [x] Sidebar navigation
- [x] Professional UI design
- [x] Responsive layout
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Data-testid attributes for testing

### ✅ Integration
- [x] End-to-end connectivity
- [x] Real-time data updates
- [x] Seamless navigation
- [x] Error feedback to users

---

## 🎨 Design Highlights

- **Color Scheme**: Purple/Indigo/Pink gradients
- **Typography**: Modern sans-serif fonts
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Animations**: Smooth fade-in, slide-up, and hover transitions
- **Icons**: Lucide React icon library
- **Cards**: Elevated cards with hover effects
- **Buttons**: Gradient buttons with smooth transitions

---

## 📝 Usage Examples

### Creating a Scene via UI
1. Click "Create Scene" in sidebar
2. Fill in scene details (ID, concept, visual type, narration)
3. Click "Save Scene"
4. Scene appears in library

### Searching Scenes
1. Go to "Scene Library"
2. Type search term in search box
3. Click search button or press Enter
4. Results filter in real-time

### Editing a Scene
1. In Scene Library, click edit icon on a scene card
2. Modify fields in modal
3. Click "Save Scene"
4. Changes reflect immediately

---

## 🚀 Future Enhancements

Potential features for future development:
- Video preview functionality
- Bulk scene operations
- Scene templates
- Export/import scenes
- Real-time Manim rendering
- Collaborative editing
- User authentication
- Advanced search filters
- Scene versioning
- Animation timeline editor

---

## 📦 Dependencies Summary

### Backend
- fastapi==0.115.0
- uvicorn[standard]==0.24.0
- motor==3.3.2
- pydantic==2.9.2
- python-multipart==0.0.6

### Frontend
- react ^18.2.0
- react-dom ^18.2.0
- axios ^1.6.0
- tailwindcss ^3.4.19
- lucide-react ^0.294.0
- react-hot-toast ^2.4.1

---

## ✨ Summary

This project successfully transforms a command-line Manim animation tool into a modern, professional web application with:
- Full CRUD functionality
- Beautiful, polished UI
- Real-time search
- Statistics dashboard
- End-to-end integration
- Professional design patterns
- Responsive layout
- Advanced features ready for production

The application is fully functional and ready for use! 🎉
