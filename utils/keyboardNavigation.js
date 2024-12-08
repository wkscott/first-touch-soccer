export const handleKeyboardNavigation = (event, elements, currentIndex) => {
    const KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        HOME: 36,
        END: 35
    };

    switch (event.keyCode) {
        case KEY.LEFT:
        case KEY.UP:
            event.preventDefault();
            return (currentIndex - 1 + elements.length) % elements.length;

        case KEY.RIGHT:
        case KEY.DOWN:
            event.preventDefault();
            return (currentIndex + 1) % elements.length;

        case KEY.HOME:
            event.preventDefault();
            return 0;

        case KEY.END:
            event.preventDefault();
            return elements.length - 1;

        default:
            return currentIndex;
    }
};

export const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
}; 