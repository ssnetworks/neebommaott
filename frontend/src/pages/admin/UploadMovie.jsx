import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../../utils/movieService';
import { Link as LinkIcon, CheckCircle } from 'lucide-react';
import './UploadMovie.css';

const UploadMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: new Date().getFullYear(),
    genre: '',
    language: 'Telugu',
    duration: '',
    downloadUrl: '',
    isFeatured: 'false',
    posterUrl: '',
    videoUrl: '',
    aspectRatio: '16:9'
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
    
    if (!formData.posterUrl || !formData.videoUrl) {
      setError('Please provide Google Drive links for both the poster and video.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const movieData = {
        title: formData.title,
        description: formData.description,
        releaseYear: Number(formData.releaseYear),
        genre: formData.genre.split(',').map(g => g.trim()),
        language: formData.language,
        duration: Number(formData.duration),
        isFeatured: formData.isFeatured === 'true',
        posterUrl: formData.posterUrl,
        videoUrl: formData.videoUrl,
        downloadUrl: formData.downloadUrl,
        aspectRatio: formData.aspectRatio
      };

      await movieService.createMovie(movieData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard/movies');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError('Error uploading movie. ' + err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="upload-success animate-fade-in">
        <CheckCircle size={64} color="var(--accent-primary)" />
        <h2>Movie Uploaded Successfully!</h2>
        <p>Redirecting to movie manager...</p>
      </div>
    );
  }

  return (
    <div className="upload-movie-page animate-fade-in">
      <div className="upload-header">
        <h2>Publish New Movie</h2>
        <p>Add a new movie using Google Drive direct links.</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form glass-panel">
        <div className="form-grid">
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Movie Title *</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Release Year *</label>
                <input type="number" className="form-control" name="releaseYear" value={formData.releaseYear} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (mins) *</label>
                <input type="number" className="form-control" name="duration" value={formData.duration} onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Genres (comma separated) *</label>
                <input type="text" className="form-control" name="genre" value={formData.genre} onChange={handleInputChange} placeholder="Action, Drama" required />
              </div>
              <div className="form-group">
                <label className="form-label">Language *</label>
                <select className="form-control" name="language" value={formData.language} onChange={handleInputChange}>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                  <option value="Malayalam">Malayalam</option>
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Video Aspect Ratio *</label>
              <select className="form-control" name="aspectRatio" value={formData.aspectRatio} onChange={handleInputChange}>
                <option value="16:9">16:9 (Standard Widescreen)</option>
                <option value="21:9">21:9 (Cinematic Ultrawide)</option>
                <option value="4:3">4:3 (Classic TV)</option>
              </select>
            </div>
          </div>
          
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Poster Image (Google Drive URL) *</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input type="url" className="form-control" name="posterUrl" value={formData.posterUrl} onChange={handleInputChange} style={{ paddingLeft: '40px' }} required placeholder="https://drive.google.com/..." />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Video Stream (Google Drive URL) *</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input type="url" className="form-control" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} style={{ paddingLeft: '40px' }} required placeholder="https://drive.google.com/..." />
              </div>
              <small style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>Ensure the Google Drive links are set to "Anyone with the link can view".</small>
            </div>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Direct Download Link (Optional)</label>
              <input type="url" className="form-control" name="downloadUrl" value={formData.downloadUrl} onChange={handleInputChange} placeholder="https://..." />
            </div>
            
            <div className="form-group checkbox-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured === 'true'} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked ? 'true' : 'false'})} />
                Feature on Homepage Banner
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-footer">

          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadMovie;
