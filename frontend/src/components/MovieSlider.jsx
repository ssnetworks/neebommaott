import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import './MovieSlider.css';

const MovieSlider = ({ title, movies }) => {
  const sliderRef = useRef(null);

  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -sliderRef.current.offsetWidth : sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-slider-container">
      <h2 className="slider-title">{title}</h2>
      
      <div className="slider-wrapper">
        <button 
          className="slider-control left" 
          onClick={() => slide('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={30} />
        </button>
        
        <div className="slider" ref={sliderRef}>
          {movies.map((movie) => (
            <div key={movie._id} className="slide-item">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        <button 
          className="slider-control right" 
          onClick={() => slide('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default MovieSlider;
