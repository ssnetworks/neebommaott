import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { podcastService } from '../../utils/podcastService';
import { Link as LinkIcon, CheckCircle } from 'lucide-react';
import './UploadPodcast.css';

const UploadPodcast = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    host: '',
    coverImageUrl: '',
    audioUrl: '',
    isFeatured: 'false'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coverImageUrl || !formData.audioUrl) {
      setError('Please provide valid links for both the cover image and audio stream.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const podcastData = {
        title: formData.title,
        description: formData.description,
        host: formData.host,
        isFeatured: formData.isFeatured === 'true',
        coverImageUrl: formData.coverImageUrl,
        audioUrl: formData.audioUrl
      };

      await podcastService.createPodcast(podcastData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard/podcasts');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError('Error uploading podcast. ' + err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="upload-success animate-fade-in">
        <CheckCircle size={64} color="var(--accent-primary)" />
        <h2>Podcast Uploaded Successfully!</h2>
        <p>Redirecting to podcast manager...</p>
      </div>
    );
  }

  return (
    <div className="upload-podcast-page animate-fade-in">
      <div className="upload-header">
        <h2>Publish New Podcast</h2>
        <p>Add a new podcast using Google Drive direct links or external URLs.</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form glass-panel">
        <div className="form-grid">
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Podcast Title *</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Host / Author *</label>
              <input type="text" className="form-control" name="host" value={formData.host} onChange={handleInputChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="6" required></textarea>
            </div>
          </div>
          
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Cover Image URL *</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input type="url" className="form-control" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleInputChange} style={{ paddingLeft: '40px' }} required placeholder="https://..." />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Audio Stream URL *</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input type="url" className="form-control" name="audioUrl" value={formData.audioUrl} onChange={handleInputChange} style={{ paddingLeft: '40px' }} required placeholder="https://..." />
              </div>
              <small style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>Ensure the audio file link is publicly accessible.</small>
            </div>
            
            <div className="form-group checkbox-group" style={{ marginTop: '2rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured === 'true'} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked ? 'true' : 'false'})} />
                Feature this Podcast
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-footer">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Podcast'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPodcast;
