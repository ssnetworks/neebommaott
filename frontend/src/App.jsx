import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="main-content">
                <Home />
              </main>
            </>
          } />
          <Route path="/movie/:id" element={
            <>
              <Navbar />
              <main className="main-content">
                <MovieDetails />
              </main>
            </>
          } />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/search" element={
            <>
              <Navbar />
              <main className="main-content">
                <SearchResults />
              </main>
            </>
          } />
          <Route path="/movies" element={
            <>
              <Navbar />
              <main className="main-content">
                <Movies />
              </main>
            </>
          } />
          <Route path="/podcasts" element={
            <>
              <Navbar />
              <main className="main-content">
                <Podcasts />
              </main>
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
