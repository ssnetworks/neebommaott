import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          NEE<span>BOMMA</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
          <Link to="/podcasts" className="nav-link">Podcasts</Link>
        </div>

        <div className="navbar-actions">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="search-form animate-fade-in" style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Search movies..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--accent-primary)',
                  color: 'white',
                  padding: '5px',
                  outline: 'none',
                  width: '200px'
                }}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} style={{ color: 'white', marginLeft: '10px' }}>
                <X size={20} />
              </button>
            </form>
          ) : (
            <Search className="search-icon" size={24} onClick={() => setIsSearchOpen(true)} />
          )}
          
          {/* Mobile menu toggle */}
          <div className="mobile-menu-toggle" style={{ display: 'none', cursor: 'pointer' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
