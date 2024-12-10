import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Logo from './components/Logo';
import PublicForum from './components/PublicForum';
import Calendar from './components/Calendar';
import RegisterForm from './components/RegisterForm';

function App() {
  const venmoLink = "https://venmo.com/first-touch-soccer";

  const Home = () => (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Elevate Your Soccer Game</h1>
          <p>Professional coaching for all skill levels</p>
          <Link to="/calendar" className="book-button">Book a Session</Link>
        </div>
      </section>

      <section id="coaches" className="section coaches-section">
        <h2>Our Expert Coaches</h2>
        <div className="coaches-grid">
          <div className="coach-card">
            <div className="coach-image"></div>
            <h3>Richard Scott</h3>
            <p>Head Coach</p>
          </div>
          <div className="coach-card">
            <div className="coach-image"></div>
            <h3>Will Scott</h3>
            <p>Assistant Coach</p>
          </div>
          <div className="coach-card">
            <div className="coach-image"></div>
            <h3>Ben Scott</h3>
            <p>Assistant Coach</p>
          </div>
          <div className="coach-card">
            <div className="coach-image"></div>
            <h3>Landrey McCann</h3>
            <p>Assistant Coach</p>
          </div>
        </div>
      </section>

      <PublicForum />
    </>
  );

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-content">
            <Logo />
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#coaches">Coaches</a></li>
              <li><Link to="/register" className="register-button">Register Here</Link></li>
              <li><a href={venmoLink} target="_blank" rel="noopener noreferrer" className="payment-link">Pay Now</a></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 