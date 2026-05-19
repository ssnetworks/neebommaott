import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
        <div className="movie-overlay">
          <Link to={`/player/${movie._id}`} className="play-btn">
            <Play size={24} fill="currentColor" />
          </Link>
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-meta">
              <span>{movie.releaseYear}</span>
              <span className="dot">•</span>
              <span>{movie.duration}m</span>
            </div>
            <p className="movie-genre">{movie.genre.slice(0, 2).join(', ')}</p>
          </div>
        </div>
      </div>
      <Link to={`/movie/${movie._id}`} className="movie-link" aria-label={`View details for ${movie.title}`}></Link>
    </div>
  );
};

export default MovieCard;
