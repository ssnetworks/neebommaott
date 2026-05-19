import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { movieService } from '../utils/movieService';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const allMovies = await movieService.getMovies();
        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="movies-page-container animate-fade-in">
      <div className="movies-page-header">
        <h1>All <span>Movies</span></h1>
        <p>Explore our complete collection of blockbuster hits and classic cinema.</p>
      </div>

      <div className="container">
        {loading ? (
          <div className="loader">Loading Movies...</div>
        ) : movies.length > 0 ? (
          <div className="movies-grid animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No movies available yet.</h3>
            <p>Check back soon for new additions!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
