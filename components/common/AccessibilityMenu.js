import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import './AccessibilityMenu.css';

const AccessibilityMenu = () => {
    const { highContrast, fontSize, updatePreferences } = useAccessibility();

    return (
        <div 
            className="accessibility-menu" 
            role="dialog" 
            aria-label="Accessibility settings"
        >
            <h2 id="a11y-title" className="sr-only">Accessibility Settings</h2>
            
            <div className="a11y-option">
                <label htmlFor="high-contrast">
                    High Contrast
                    <span className="sr-only">Toggle high contrast mode</span>
                </label>
                <button
                    id="high-contrast"
                    className={`toggle-button ${highContrast ? 'active' : ''}`}
                    onClick={() => updatePreferences({ highContrast: !highContrast, fontSize })}
                    aria-pressed={highContrast}
                >
                    {highContrast ? 'On' : 'Off'}
                </button>
            </div>

            <div className="a11y-option">
                <label htmlFor="font-size">
                    Text Size
                    <span className="sr-only">Adjust text size</span>
                </label>
                <select
                    id="font-size"
                    value={fontSize}
                    onChange={(e) => updatePreferences({ 
                        highContrast, 
                        fontSize: e.target.value 
                    })}
                    aria-label="Select text size"
                >
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                </select>
            </div>

            <button 
                className="skip-link"
                onClick={() => document.querySelector('main').focus()}
                aria-label="Skip to main content"
            >
                Skip to Main Content
            </button>
        </div>
    );
};

export default AccessibilityMenu; 