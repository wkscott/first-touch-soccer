import React, { useEffect } from 'react';
import './BookingPage.css';

function BookingPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="booking-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">First Touch Soccer</div>
          <ul className="nav-links">
            <li><a href="/">Back to Home</a></li>
          </ul>
        </div>
      </nav>

      <main className="booking-container">
        <h1>Book Your Session</h1>
        <div className="calendar-container">
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/wkscott715/30min"
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </main>
    </div>
  );
}

export default BookingPage; 