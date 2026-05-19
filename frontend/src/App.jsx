import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Player from './pages/Player';
import SearchResults from './pages/SearchResults';
import Movies from './pages/Movies';
import Podcasts from './pages/Podcasts';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <div className="app-container">
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="main-content">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/movie/:id" element={
            <>
              <Navbar />
              <main className="main-content">
                <MovieDetails />
              </main>
              <Footer />
            </>
          } />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/search" element={
            <>
              <Navbar />
              <main className="main-content">
                <SearchResults />
              </main>
              <Footer />
            </>
          } />
          <Route path="/movies" element={
            <>
              <Navbar />
              <main className="main-content">
                <Movies />
              </main>
              <Footer />
            </>
          } />
          <Route path="/podcasts" element={
            <>
              <Navbar />
              <main className="main-content">
                <Podcasts />
              </main>
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
