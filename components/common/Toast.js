import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast ${type} ${isVisible ? 'visible' : ''}`}>
            <div className="toast-content">
                {type === 'error' && <span className="toast-icon">⚠️</span>}
                {type === 'success' && <span className="toast-icon">✅</span>}
                {type === 'info' && <span className="toast-icon">ℹ️</span>}
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={() => onClose()}>×</button>
        </div>
    );
};

export default Toast; 