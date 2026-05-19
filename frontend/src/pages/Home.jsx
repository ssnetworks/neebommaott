import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieSlider from '../components/MovieSlider';
import { movieService } from '../utils/movieService';
import './Home.css';

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trending = await movieService.getTrendingMovies();
        setTrendingMovies(trending);
        
        const recent = await movieService.getMovies();
        setRecentMovies(recent);
        
        // Find featured movie, or just use the first trending one
        const featured = recent.find(m => m.isFeatured);
        if (featured) {
          setFeaturedMovie(featured);
        } else if (trending.length > 0) {
          setFeaturedMovie(trending[0]);
        }
      } catch (error) {
        console.error('Error fetching movies from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="home-page animate-fade-in">
      <HeroBanner movie={featuredMovie} />
      
      <div className="home-content">
        <MovieSlider title="Trending Now" movies={trendingMovies} />
        <MovieSlider title="Recently Added" movies={recentMovies} />
        <MovieSlider title="Telugu Blockbusters" movies={trendingMovies.slice().reverse()} />
      </div>
    </div>
  );
};

export default Home;
