import { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 2.8 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2800);

    // Call onComplete to unmount after the fade-out animation completes (3.5 seconds total)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-container ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <h1 className="splash-logo">
          <span className="logo-text">NEE</span> <span className="logo-text logo-highlight">BOMMA</span>
        </h1>
        <div className="splash-subtitle">Premium OTT Experience</div>
      </div>
    </div>
  );
};

export default SplashScreen;
