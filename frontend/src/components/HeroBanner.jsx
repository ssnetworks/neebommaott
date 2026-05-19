import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="hero-banner animate-fade-in">
      <div className="hero-backdrop" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
        <div className="hero-gradient"></div>
      </div>
      
      <div className="container hero-content">
        <h1 className="hero-title animate-slide-up">{movie.title}</h1>
        
        <div className="hero-meta animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="hero-year">{movie.releaseYear}</span>
          <span className="hero-duration">{movie.duration} min</span>
          <span className="hero-genre">{movie.genre.join(' • ')}</span>
        </div>
        
        <p className="hero-description animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {movie.description}
        </p>
        
        <div className="hero-actions animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link to={`/player/${movie._id}`} className="btn btn-primary">
            <Play size={20} fill="currentColor" /> Play Now
          </Link>
          <Link to={`/movie/${movie._id}`} className="btn btn-secondary">
            <Info size={20} /> More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
