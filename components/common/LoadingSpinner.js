import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', overlay = false }) => {
    const spinnerClass = `spinner ${size} ${overlay ? 'overlay' : ''}`;
    
    return (
        <div className={spinnerClass}>
            <div className="spinner-circle"></div>
            <div className="spinner-circle inner"></div>
            <div className="spinner-circle outer"></div>
        </div>
    );
};

export default LoadingSpinner; 