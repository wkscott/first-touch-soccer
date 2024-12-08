import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState('normal');
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        // Check user's system preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setReducedMotion(prefersReducedMotion);

        // Apply stored preferences
        const storedPreferences = localStorage.getItem('accessibility-preferences');
        if (storedPreferences) {
            const { highContrast, fontSize } = JSON.parse(storedPreferences);
            setHighContrast(highContrast);
            setFontSize(fontSize);
        }
    }, []);

    const updatePreferences = (preferences) => {
        localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
        setHighContrast(preferences.highContrast);
        setFontSize(preferences.fontSize);
    };

    return (
        <AccessibilityContext.Provider value={{
            highContrast,
            fontSize,
            reducedMotion,
            updatePreferences
        }}>
            <div className={`
                ${highContrast ? 'high-contrast' : ''}
                ${`font-size-${fontSize}`}
                ${reducedMotion ? 'reduced-motion' : ''}
            `}>
                {children}
            </div>
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => useContext(AccessibilityContext); 