import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const hasConsent = localStorage.getItem('cookieConsent');
        if (!hasConsent) {
            setShowConsent(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShowConsent(false);
    };

    if (!showConsent) return null;

    return (
        <div className="cookie-consent">
            <p>
                We use cookies to improve your experience. By using our site, you
                agree to our use of cookies.
            </p>
            <div className="cookie-buttons">
                <button onClick={handleAccept}>Accept</button>
                <a href="/cookie-policy">Learn More</a>
            </div>
        </div>
    );
};

export default CookieConsent; 