import React from 'react';
import './VenmoPopup.css';
import venmoQR from '../assets/venmo-qr.png'; // You'll need to add the QR image to your assets folder

function VenmoPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Scan to Pay</h2>
        <img src={venmoQR} alt="Venmo QR Code" className="qr-code" />
        <p>@first-touch-soccer</p>
      </div>
    </div>
  );
}

export default VenmoPopup; 