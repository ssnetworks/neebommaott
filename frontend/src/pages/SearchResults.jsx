import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { movieService } from '../utils/movieService';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q');
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const results = await movieService.searchMovies(query);
        setMovies(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (!query) {
    return <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}><h2>Please enter a search term</h2></div>;
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '100px', minHeight: '60vh' }}>
      <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
        Search Results for: <span style={{ color: 'var(--accent-primary)' }}>"{query}"</span>
      </h2>
      
      {loading ? (
        <div className="loader">Searching...</div>
      ) : movies.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
          {movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No movies found matching your search.</h3>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Return Home</Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
