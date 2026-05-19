import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Download, Star, Clock, Calendar, Globe } from 'lucide-react';
import { movieService } from '../utils/movieService';
import MovieSlider from '../components/MovieSlider';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const data = await movieService.getMovieById(id);
        setMovie(data);
        
        // Fetch related movies based on genre
        if (data.genre && data.genre.length > 0) {
          const allMovies = await movieService.getMovies({ genre: data.genre[0] });
          setRelatedMovies(allMovies.filter(m => m._id !== id));
        }
      } catch (error) {
        console.error('Error fetching movie details from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loader">Loading Details...</div>;
  if (!movie) return <div className="error-message">Movie not found</div>;

  return (
    <div className="movie-details-page animate-fade-in">
      <div className="details-backdrop" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
        <div className="details-overlay"></div>
      </div>
      
      <div className="container details-content">
        <div className="details-grid">
          <div className="details-poster animate-slide-up">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          
          <div className="details-info animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="details-title">{movie.title}</h1>
            
            <div className="details-meta-bar">
              <div className="meta-item"><Calendar size={18} /> {movie.releaseYear}</div>
              <div className="meta-item"><Clock size={18} /> {movie.duration} min</div>
              <div className="meta-item"><Globe size={18} /> {movie.language}</div>
              <div className="meta-item"><Star size={18} className="star-icon" /> {Math.floor(movie.views / 1000)}k views</div>
            </div>
            
            <div className="details-genres">
              {movie.genre?.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>
            
            <p className="details-description">{movie.description}</p>
            
            <div className="details-actions">
              <Link to={`/player/${movie._id}`} className="btn btn-primary btn-lg">
                <Play size={24} fill="currentColor" /> Stream Now
              </Link>
              
              {movie.downloadUrl && (
                <a href={movie.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
                  <Download size={24} /> Download
                </a>
              )}
            </div>
          </div>
        </div>
        
        {relatedMovies.length > 0 && (
          <div className="related-section">
            <MovieSlider title="You May Also Like" movies={relatedMovies} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
