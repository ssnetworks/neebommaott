import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Film, Upload, LogOut, Settings } from 'lucide-react';
import MovieManager from './MovieManager';
import UploadMovie from './UploadMovie';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin<span>Panel</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard')}`}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </Link>
          <Link to="/admin/dashboard/movies" className={`nav-item ${isActive('/admin/dashboard/movies')}`}>
            <Film size={20} />
            <span>Manage Movies</span>
          </Link>
          <Link to="/admin/dashboard/upload" className={`nav-item ${isActive('/admin/dashboard/upload')}`}>
            <Upload size={20} />
            <span>Upload Movie</span>
          </Link>
          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="admin-main">
        <div className="admin-topbar">
          <h2>Dashboard</h2>
          <div className="admin-profile">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </div>
        
        <div className="admin-content">
          <Routes>
            <Route path="/" element={
              <div className="dashboard-overview animate-fade-in">
                <div className="stats-grid">
                  <div className="stat-card glass-panel">
                    <h3>Total Movies</h3>
                    <div className="stat-value">124</div>
                  </div>
                  <div className="stat-card glass-panel">
                    <h3>Total Views</h3>
                    <div className="stat-value">845.2K</div>
                  </div>
                  <div className="stat-card glass-panel">
                    <h3>Downloads</h3>
                    <div className="stat-value">12.4K</div>
                  </div>
                </div>
                
                <div className="recent-activity glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
                  <h3>System Status</h3>
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>All systems operational. MongoDB connected. Storage is at 45% capacity.</p>
                </div>
              </div>
            } />
            <Route path="movies" element={<MovieManager />} />
            <Route path="upload" element={<UploadMovie />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
