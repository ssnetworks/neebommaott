import { useEffect } from 'react';
import './Podcasts.css';

const Podcasts = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="podcasts-page animate-fade-in">
      <div className="podcasts-overlay"></div>
      
      <div className="podcasts-content">
        <div className="glowing-circle"></div>
        <div className="glowing-circle secondary"></div>
        
        <div className="glass-card animate-slide-up">
          <div className="icon-wrapper pulse-animation">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          </div>
          
          <h1 className="glitch-text" data-text="PODCASTS">PODCASTS</h1>
          <h2 className="coming-soon-text">STREAMING SOON</h2>
          
          <p className="description">
            Get ready for exclusive interviews, behind-the-scenes stories, 
            and deep dives into your favorite Tollywood hits. We are building 
            a premium audio experience just for you.
          </p>
          
          <div className="progress-bar-container mt-4">
            <div className="progress-bar loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcasts;
