import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Search } from 'lucide-react';
import { movieService } from '../../utils/movieService';
import './MovieManager.css';

const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await movieService.getMovies();
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies for admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      try {
        await movieService.deleteMovie(id);
        setMovies(movies.filter(movie => movie._id !== id));
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Failed to delete movie');
      }
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="movie-manager-page animate-fade-in">
      <div className="manager-header">
        <div>
          <h2>Manage Movies</h2>
          <p>View, edit, or delete existing movies in the Firebase database.</p>
        </div>
        
        <div className="manager-actions">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <Link to="/admin/dashboard/upload" className="btn btn-primary">
            + Add New Movie
          </Link>
        </div>
      </div>

      <div className="manager-content glass-panel">
        {loading ? (
          <div className="loader" style={{ height: '200px' }}>Loading...</div>
        ) : filteredMovies.length === 0 ? (
          <div className="empty-state">
            <p>No movies found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Release Year</th>
                  <th>Genre</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map(movie => (
                  <tr key={movie._id}>
                    <td>
                      <div className="table-poster">
                        <img src={movie.posterUrl} alt={movie.title} />
                      </div>
                    </td>
                    <td>
                      <div className="table-title">{movie.title}</div>
                      {movie.isFeatured && <span className="badge">Featured</span>}
                    </td>
                    <td>{movie.releaseYear}</td>
                    <td>{movie.genre?.join(', ')}</td>
                    <td>{movie.views?.toLocaleString() || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(movie._id)}>
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

export default MovieManager;
