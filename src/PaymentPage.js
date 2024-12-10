import React from 'react';
import './PaymentPage.css';

function PaymentPage() {
  return (
    <div className="payment-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">First Touch Soccer</div>
          <ul className="nav-links">
            <li><a href="/">Back to Home</a></li>
          </ul>
        </div>
      </nav>

      <main className="payment-container">
        <h1>Training Packages</h1>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <h2>Single Session</h2>
            <p className="price">$50</p>
            <ul className="features">
              <li>60-minute session</li>
              <li>One-on-one training</li>
              <li>Skill assessment</li>
              <li>Personalized feedback</li>
            </ul>
            <button className="payment-button">Select</button>
          </div>

          <div className="pricing-card featured">
            <h2>5 Session Package</h2>
            <p className="price">$225</p>
            <p className="savings">Save $25</p>
            <ul className="features">
              <li>5 x 60-minute sessions</li>
              <li>One-on-one training</li>
              <li>Progress tracking</li>
              <li>Video analysis</li>
              <li>Training plan</li>
            </ul>
            <button className="payment-button">Select</button>
          </div>

          <div className="pricing-card">
            <h2>10 Session Package</h2>
            <p className="price">$400</p>
            <p className="savings">Save $100</p>
            <ul className="features">
              <li>10 x 60-minute sessions</li>
              <li>One-on-one training</li>
              <li>Progress tracking</li>
              <li>Video analysis</li>
              <li>Comprehensive training plan</li>
              <li>Priority scheduling</li>
            </ul>
            <button className="payment-button">Select</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentPage; 