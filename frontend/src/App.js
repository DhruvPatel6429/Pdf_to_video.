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
    <div className="min-h-screen bg-black">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="glass-effect-dark border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-cyan-400 hover:bg-cyan-500/10 p-2 rounded-lg"
                data-testid="sidebar-toggle"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-3">
                <Sparkles className="text-cyan-400" size={32} />
                <h1 className="text-2xl font-bold text-white">ML Animation Studio</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-cyan-500/10 rounded-full px-4 py-2 border border-cyan-500/20">
                <Activity className="text-green-400" size={20} />
                <span className="text-cyan-100 text-sm font-medium">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 lg:top-0 h-[calc(100vh-4rem)] lg:h-screen w-64 glass-effect-dark border-r border-cyan-500/20 transition-transform duration-300 z-40`}>
          <nav className="p-6 space-y-2" data-testid="sidebar-nav">
            <button
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                view === 'dashboard' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300'
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
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300'
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all"
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
        <p className="text-gray-400">Overview of your ML animation project</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Book className="text-cyan-400" size={32} />}
          label="Total Scenes"
          value={stats?.total_scenes || 0}
          color="cyan"
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
      <div className="glass-effect-dark rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Visual Types Distribution</h3>
        <div className="space-y-3">
          {stats?.visual_types && Object.entries(stats.visual_types).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
              <div className="flex items-center gap-3">
                <div className="w-48 bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
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
      <div className="glass-effect-dark rounded-2xl p-6 border border-cyan-500/20">
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
          <p className="text-gray-400">Manage and explore your animation scenes</p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search scenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            data-testid="search-input"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all flex items-center gap-2"
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
          <Book className="mx-auto text-gray-600 mb-4" size={64} />
          <p className="text-gray-400 text-lg">No scenes found</p>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
    pink: 'border-pink-500/30 bg-pink-500/10'
  };

  return (
    <div className={`glass-effect-dark rounded-2xl p-6 card-hover border ${colorClasses[color]}`} data-testid={`stat-card-${label.toLowerCase().replace(' ', '-')}`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <div className={`px-3 py-1 bg-${color}-500/20 rounded-full border border-${color}-500/30`}>
          <span className={`text-${color}-300 text-sm font-medium`}>Active</span>
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// Scene Card Component
function SceneCard({ scene, compact = false, onEdit, onDelete }) {
  return (
    <div className="glass-effect-dark rounded-xl p-5 card-hover border border-cyan-500/20" data-testid={`scene-card-${scene.scene_id}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
            {scene.scene_id}
          </div>
          <div>
            <h3 className="text-white font-semibold">{scene.concept}</h3>
            <span className="text-xs text-gray-400 capitalize">{scene.visual}</span>
          </div>
        </div>
        
        {!compact && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-cyan-500/20 rounded-lg text-gray-400 hover:text-cyan-400 transition-all"
              data-testid={`edit-scene-${scene.scene_id}`}
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all"
              data-testid={`delete-scene-${scene.scene_id}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      {!compact && (
        <>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {scene.explanation[0]}
          </p>
          
          {scene.equations.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-2 mb-3 border border-cyan-500/20">
              <code className="text-cyan-400 text-xs">{scene.equations[0]}</code>
            </div>
          )}
          
          <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all">
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
    
    // Ensure explanation and equations are arrays
    const dataToSave = {
      ...formData,
      explanation: Array.isArray(formData.explanation) 
        ? formData.explanation.filter(e => e.trim()) 
        : formData.explanation.split('\n').filter(e => e.trim()),
      equations: Array.isArray(formData.equations)
        ? formData.equations.filter(e => e.trim())
        : formData.equations.split('\n').filter(e => e.trim())
    };
    
    // Ensure at least one item in arrays
    if (dataToSave.explanation.length === 0) dataToSave.explanation = [''];
    if (dataToSave.equations.length === 0) dataToSave.equations = [''];
    
    onSave(dataToSave);
  };

  const handleExplanationChange = (e) => {
    setFormData({...formData, explanation: e.target.value.split('\n')});
  };

  const handleEquationsChange = (e) => {
    setFormData({...formData, equations: e.target.value.split('\n')});
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-testid="scene-editor-modal">
      <div className="glass-effect-dark rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {scene ? 'Edit Scene' : 'Create New Scene'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all"
            data-testid="close-modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Scene ID</label>
            <input
              type="number"
              value={formData.scene_id}
              onChange={(e) => setFormData({...formData, scene_id: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              disabled={!!scene}
              data-testid="scene-id-input"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Concept</label>
            <input
              type="text"
              value={formData.concept}
              onChange={(e) => setFormData({...formData, concept: e.target.value})}
              className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
              data-testid="concept-input"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Explanation <span className="text-xs text-gray-500">(one per line)</span>
            </label>
            <textarea
              value={Array.isArray(formData.explanation) ? formData.explanation.join('\n') : formData.explanation}
              onChange={handleExplanationChange}
              rows={3}
              className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter explanation points, one per line"
              data-testid="explanation-input"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Equations <span className="text-xs text-gray-500">(one per line)</span>
            </label>
            <textarea
              value={Array.isArray(formData.equations) ? formData.equations.join('\n') : formData.equations}
              onChange={handleEquationsChange}
              rows={2}
              className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter equations, one per line (e.g., y = mx + b)"
              data-testid="equations-input"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Visual Type</label>
            <select
              value={formData.visual}
              onChange={(e) => setFormData({...formData, visual: e.target.value})}
              className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
              data-testid="visual-type-select"
            >
              <option value="none" className="bg-gray-900 text-white py-2">None</option>
              <option value="linear_regression" className="bg-gray-900 text-white py-2">Linear Regression</option>
              <option value="loss_curve" className="bg-gray-900 text-white py-2">Loss Curve</option>
              <option value="gradient_descent" className="bg-gray-900 text-white py-2">Gradient Descent</option>
              <option value="neural_network" className="bg-gray-900 text-white py-2">Neural Network</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Narration</label>
            <textarea
              value={formData.narration}
              onChange={(e) => setFormData({...formData, narration: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter the narration text for this scene"
              data-testid="narration-input"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all border border-gray-700"
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all"
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
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-cyan-500"></div>
    </div>
  );
}

export default App;