import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, Trash2, Plus, PlaySquare, Image as ImageIcon } from 'lucide-react';
import { adService } from '../../utils/adService';
import './AdManager.css';

const AdManager = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const data = await adService.getAds();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await adService.deleteAd(id);
        setAds(ads.filter(ad => ad._id !== id));
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await adService.updateAd(id, { isActive: !currentStatus });
      setAds(ads.map(ad => ad._id === id ? { ...ad, isActive: !currentStatus } : ad));
    } catch (error) {
      console.error('Error updating ad status:', error);
    }
  };

  const filteredAds = ads.filter(ad => 
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manager-container animate-fade-in">
      <div className="manager-header">
        <div>
          <h2>Advertisements</h2>
          <p>Manage banner and pre-roll ads for the platform</p>
        </div>
        
        <div className="manager-actions">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search ads..." 
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/admin/dashboard/upload-ad" className="btn btn-primary">
            <Plus size={20} /> Create Ad
          </Link>
        </div>
      </div>

      <div className="manager-content glass-panel">
        {loading ? (
          <div className="loader">Loading Ads...</div>
        ) : filteredAds.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Media</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => (
                  <tr key={ad._id}>
                    <td>
                      <div className="table-ad-media">
                        {ad.adType === 'banner' ? (
                          <img src={ad.mediaUrl} alt={ad.title} />
                        ) : (
                          <div className="video-icon-placeholder">
                            <PlaySquare size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-title">{ad.title}</div>
                      <a href={ad.targetUrl} target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: '#0071eb'}}>{ad.targetUrl}</a>
                    </td>
                    <td>
                      <span className={`badge ${ad.adType === 'preroll' ? 'badge-preroll' : 'badge-banner'}`}>
                        {ad.adType === 'preroll' ? 'Pre-roll Video' : 'Banner Image'}
                      </span>
                    </td>
                    <td>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={ad.isActive} 
                          onChange={() => toggleActive(ad._id, ad.isActive)} 
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div><strong>Imp:</strong> {ad.impressions || 0}</div>
                        <div><strong>Clicks:</strong> {ad.clicks || 0}</div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit" title="Edit Ad">
                          <Edit size={16} />
                        </button>
                        <button 
                          className="icon-btn delete" 
                          title="Delete Ad"
                          onClick={() => handleDelete(ad._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No advertisements found</h3>
            <p>You haven't created any ads yet.</p>
            <Link to="/admin/dashboard/upload-ad" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Create Your First Ad
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdManager;
