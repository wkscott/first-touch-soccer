import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import './Button.css';

const Button = ({ 
    children, 
    onClick, 
    disabled, 
    ariaLabel, 
    type = 'button',
    variant = 'primary'
}) => {
    const { highContrast } = useAccessibility();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`button ${variant} ${highContrast ? 'high-contrast' : ''}`}
            aria-label={ariaLabel || children}
            role="button"
            tabIndex={disabled ? -1 : 0}
        >
            {children}
        </button>
    );
};

export default Button; 