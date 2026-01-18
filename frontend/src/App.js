import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Play, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Activity,
  Book,
  Video,
  Music,
  TrendingUp,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [scenes, setScenes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScene, setSelectedScene] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState('dashboard'); // dashboard, scenes, editor
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scenesRes, statsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/scenes`),
        axios.get(`${BACKEND_URL}/api/stats`)
      ]);
      setScenes(scenesRes.data.scenes);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/scenes/search/${searchQuery}`);
      setScenes(response.data.scenes);
      toast.success(`Found ${response.data.total} scenes`);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleDeleteScene = async (sceneId) => {
    if (!window.confirm('Are you sure you want to delete this scene?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/scenes/${sceneId}`);
      toast.success('Scene deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete scene');
    }
  };

  const handleEditScene = (scene) => {
    setSelectedScene(scene);
    setShowModal(true);
  };

  const handleSaveScene = async (sceneData) => {
    try {
      if (selectedScene) {
        await axios.put(`${BACKEND_URL}/api/scenes/${selectedScene.scene_id}`, sceneData);
        toast.success('Scene updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/scenes`, sceneData);
        toast.success('Scene created successfully');
      }
      setShowModal(false);
      setSelectedScene(null);
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to save scene';
      toast.error(errorMessage);
      console.error('Save error:', error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
                data-testid="sidebar-toggle"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-3">
                <Sparkles className="text-yellow-400" size={32} />
                <h1 className="text-2xl font-bold text-white">ML Animation Studio</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Activity className="text-green-400" size={20} />
                <span className="text-white text-sm font-medium">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 lg:top-0 h-[calc(100vh-4rem)] lg:h-screen w-64 glass-effect border-r border-white/20 transition-transform duration-300 z-40`}>
          <nav className="p-6 space-y-2" data-testid="sidebar-nav">
            <button
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                view === 'dashboard' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              data-testid="nav-dashboard"
            >
              <TrendingUp size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => setView('scenes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                view === 'scenes' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              data-testid="nav-scenes"
            >
              <Book size={20} />
              <span className="font-medium">Scene Library</span>
            </button>
            
            <button
              onClick={() => {
                setSelectedScene(null);
                setShowModal(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
              data-testid="nav-create-scene"
            >
              <Plus size={20} />
              <span className="font-medium">Create Scene</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {view === 'dashboard' && (
            <DashboardView stats={stats} scenes={scenes} loading={loading} />
          )}
          
          {view === 'scenes' && (
            <ScenesView 
              scenes={scenes}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              handleEditScene={handleEditScene}
              handleDeleteScene={handleDeleteScene}
            />
          )}
        </main>
      </div>

      {/* Scene Editor Modal */}
      {showModal && (
        <SceneEditorModal
          scene={selectedScene}
          onClose={() => {
            setShowModal(false);
            setSelectedScene(null);
          }}
          onSave={handleSaveScene}
        />
      )}
    </div>
  );
}

// Dashboard View Component
function DashboardView({ stats, scenes, loading }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="dashboard-view">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-white/70">Overview of your ML animation project</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Book className="text-blue-400" size={32} />}
          label="Total Scenes"
          value={stats?.total_scenes || 0}
          color="blue"
        />
        <StatCard
          icon={<Video className="text-purple-400" size={32} />}
          label="Animations"
          value={Object.keys(stats?.visual_types || {}).length}
          color="purple"
        />
        <StatCard
          icon={<Music className="text-pink-400" size={32} />}
          label="Audio Files"
          value={stats?.audio_files || 0}
          color="pink"
        />
      </div>

      {/* Visual Types Breakdown */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Visual Types Distribution</h3>
        <div className="space-y-3">
          {stats?.visual_types && Object.entries(stats.visual_types).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-white/80 capitalize">{type.replace('_', ' ')}</span>
              <div className="flex items-center gap-3">
                <div className="w-48 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${(count / (stats?.total_scenes || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-white font-medium w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scenes */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Scenes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenes.slice(0, 6).map((scene) => (
            <SceneCard key={scene.scene_id} scene={scene} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

// Scenes View Component
function ScenesView({ scenes, loading, searchQuery, setSearchQuery, handleSearch, handleEditScene, handleDeleteScene }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="scenes-view">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Scene Library</h2>
          <p className="text-white/70">Manage and explore your animation scenes</p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search scenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="search-input"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2"
            data-testid="search-button"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((scene) => (
          <SceneCard 
            key={scene.scene_id} 
            scene={scene}
            onEdit={() => handleEditScene(scene)}
            onDelete={() => handleDeleteScene(scene.scene_id)}
          />
        ))}
      </div>

      {scenes.length === 0 && (
        <div className="text-center py-12">
          <Book className="mx-auto text-white/30 mb-4" size={64} />
          <p className="text-white/70 text-lg">No scenes found</p>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass-effect rounded-2xl p-6 card-hover" data-testid={`stat-card-${label.toLowerCase().replace(' ', '-')}`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <div className={`px-3 py-1 bg-${color}-500/20 rounded-full`}>
          <span className={`text-${color}-300 text-sm font-medium`}>Active</span>
        </div>
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">{label}</p>
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// Scene Card Component
function SceneCard({ scene, compact = false, onEdit, onDelete }) {
  return (
    <div className="glass-effect rounded-xl p-5 card-hover" data-testid={`scene-card-${scene.scene_id}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {scene.scene_id}
          </div>
          <div>
            <h3 className="text-white font-semibold">{scene.concept}</h3>
            <span className="text-xs text-white/60 capitalize">{scene.visual}</span>
          </div>
        </div>
        
        {!compact && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
              data-testid={`edit-scene-${scene.scene_id}`}
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-500/20 rounded-lg text-white/70 hover:text-red-400 transition-all"
              data-testid={`delete-scene-${scene.scene_id}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      {!compact && (
        <>
          <p className="text-white/60 text-sm mb-3 line-clamp-2">
            {scene.explanation[0]}
          </p>
          
          {scene.equations.length > 0 && (
            <div className="bg-white/5 rounded-lg p-2 mb-3">
              <code className="text-blue-300 text-xs">{scene.equations[0]}</code>
            </div>
          )}
          
          <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all">
            <Play size={16} />
            <span className="text-sm font-medium">Preview</span>
          </button>
        </>
      )}
    </div>
  );
}

// Scene Editor Modal
function SceneEditorModal({ scene, onClose, onSave }) {
  const [formData, setFormData] = useState({
    scene_id: scene?.scene_id || 0,
    concept: scene?.concept || '',
    explanation: scene?.explanation || [''],
    equations: scene?.equations || [''],
    visual: scene?.visual || 'none',
    narration: scene?.narration || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-testid="scene-editor-modal">
      <div className="glass-effect rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {scene ? 'Edit Scene' : 'Create New Scene'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
            data-testid="close-modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Scene ID</label>
            <input
              type="number"
              value={formData.scene_id}
              onChange={(e) => setFormData({...formData, scene_id: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!scene}
              data-testid="scene-id-input"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Concept</label>
            <input
              type="text"
              value={formData.concept}
              onChange={(e) => setFormData({...formData, concept: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              data-testid="concept-input"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Visual Type</label>
            <select
              value={formData.visual}
              onChange={(e) => setFormData({...formData, visual: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: 'white' }}
              data-testid="visual-type-select"
            >
              <option value="none" style={{ background: '#1f2937', color: 'white' }}>None</option>
              <option value="linear_regression" style={{ background: '#1f2937', color: 'white' }}>Linear Regression</option>
              <option value="loss_curve" style={{ background: '#1f2937', color: 'white' }}>Loss Curve</option>
              <option value="gradient_descent" style={{ background: '#1f2937', color: 'white' }}>Gradient Descent</option>
              <option value="neural_network" style={{ background: '#1f2937', color: 'white' }}>Neural Network</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Narration</label>
            <textarea
              value={formData.narration}
              onChange={(e) => setFormData({...formData, narration: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="narration-input"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all"
              data-testid="save-button"
            >
              Save Scene
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
    </div>
  );
}

export default App;
