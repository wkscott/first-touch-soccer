import React from 'react';
import './Logo.css';

function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-text">EST 2021</div>
      <div className="logo-shield">
        <svg width="40" height="40" viewBox="0 0 40 40">
          {/* Shield background */}
          <path 
            d="M20 2 L36 8 L36 16 C36 28 20 38 20 38 C20 38 4 28 4 16 L4 8 L20 2Z" 
            fill="#2b6cb0"
          />
          
          {/* Soccer ball */}
          <circle 
            cx="20" 
            cy="20" 
            r="8" 
            fill="white"
            stroke="#2b6cb0"
            strokeWidth="2"
          />
          
          {/* Simple soccer ball pattern */}
          <path 
            d="M20 12 L24 16 L20 20 L16 16 Z" 
            fill="#2b6cb0"
          />
        </svg>
      </div>
      <div className="logo-text-bottom">FIRST TOUCH SOCCER</div>
    </div>
  );
}

export default Logo; 