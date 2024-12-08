export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return {
        isValid: password.length >= 8,
        errors: password.length < 8 ? ['Password must be at least 8 characters long'] : []
    };
};

export const validatePhone = (phone) => {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
};

export const validateRequired = (value, fieldName) => {
    return {
        isValid: value && value.trim().length > 0,
        error: !value || value.trim().length === 0 ? `${fieldName} is required` : null
    };
};

export const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return {
        isValid: selectedDate >= today,
        error: selectedDate < today ? 'Date cannot be in the past' : null
    };
};

export const validateTime = (time, date) => {
    if (!time || !date) return { isValid: false, error: 'Time is required' };
    
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    return {
        isValid: selectedDateTime > now,
        error: selectedDateTime <= now ? 'Selected time has already passed' : null
    };
}; 