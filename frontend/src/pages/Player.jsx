import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { movieService } from '../utils/movieService';
import './Player.css';


const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await movieService.getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="loader">Loading Player...</div>;
  }

  if (!movie) {
    return <div className="error-message">Movie not found</div>;
  }


  // Convert drive links to preview mode for iframe
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      // Extract file ID
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      // If it's already a preview link
      if (url.includes('/preview')) return url;
      // Handle uc?id= links
      const ucMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (ucMatch && ucMatch[1]) {
        return `https://drive.google.com/file/d/${ucMatch[1]}/preview`;
      }
    }
    return url;
  };

  const embedUrl = getEmbedUrl(movie.videoUrl);
  const isDriveLink = movie.videoUrl?.includes('drive.google.com');

  // Parse aspect ratio, fallback to 16/9
  const ratioStr = movie.aspectRatio || '16:9';
  const [w, h] = ratioStr.split(':').map(Number);
  const aspectRatioCSS = (w && h) ? `${w}/${h}` : '16/9';

  return (
    <div className="player-container">
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h2 className="player-title">{movie.title}</h2>
      </div>
      
      <div className="video-wrapper" style={{ aspectRatio: aspectRatioCSS, backgroundColor: '#000', width: '100%', maxHeight: '85vh', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
        {isDriveLink ? (
          <iframe 
            src={embedUrl} 
            width="100%" 
            height="100%" 
            allow="autoplay; fullscreen"
            frameBorder="0"
            title={movie.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        ) : (
          <video 
            src={movie.videoUrl} 
            controls 
            autoPlay 
            style={{ width: '100%', height: '100%', outline: 'none' }}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      
      <div className="player-footer">
        <div className="player-info">
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
        </div>
        
        {movie.downloadUrl && (
          <a href={movie.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary download-btn">
            <Download size={20} /> Download HD
          </a>
        )}
      </div>
    </div>
  );
};

export default Player;
