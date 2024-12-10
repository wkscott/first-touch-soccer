import React, { useEffect } from 'react';
import './Calendar.css';

function Calendar() {
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
    <div className="calendar-page">
      <div className="calendar-container">
        <h1>Book Your Training Session</h1>
        <div className="calendar-box">
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/wkscott715/30min"
            style={{ minWidth: '320px', height: '800px' }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Calendar; 