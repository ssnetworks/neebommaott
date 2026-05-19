import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Search } from 'lucide-react';
import { podcastService } from '../../utils/podcastService';
import './PodcastManager.css';

const PodcastManager = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      const data = await podcastService.getPodcasts();
      setPodcasts(data || []);
    } catch (error) {
      console.error('Error fetching podcasts for admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this podcast? This action cannot be undone.')) {
      try {
        await podcastService.deletePodcast(id);
        setPodcasts(podcasts.filter(podcast => podcast._id !== id));
      } catch (error) {
        console.error('Error deleting podcast:', error);
        alert('Failed to delete podcast');
      }
    }
  };

  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    podcast.host.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="podcast-manager-page animate-fade-in">
      <div className="manager-header">
        <div>
          <h2>Manage Podcasts</h2>
          <p>View, edit, or delete existing podcasts in the Firebase database.</p>
        </div>
        
        <div className="manager-actions">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search podcasts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <Link to="/admin/dashboard/upload-podcast" className="btn btn-primary">
            + Add New Podcast
          </Link>
        </div>
      </div>

      <div className="manager-content glass-panel">
        {loading ? (
          <div className="loader" style={{ height: '200px' }}>Loading...</div>
        ) : filteredPodcasts.length === 0 ? (
          <div className="empty-state">
            <p>No podcasts found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Host</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPodcasts.map(podcast => (
                  <tr key={podcast._id}>
                    <td>
                      <div className="table-cover">
                        <img src={podcast.coverImageUrl} alt={podcast.title} />
                      </div>
                    </td>
                    <td>
                      <div className="table-title">{podcast.title}</div>
                      {podcast.isFeatured && <span className="badge">Featured</span>}
                    </td>
                    <td>{podcast.host}</td>
                    <td>{podcast.views?.toLocaleString() || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(podcast._id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastManager;
