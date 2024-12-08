import React, { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from './common/LoadingSpinner';
import { validateDate, validateTime, validateRequired } from '../utils/validation';

const BookingForm = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: ''
    });
    const [errors, setErrors] = useState({});
    const { showNotification } = useNotification();

    const validateForm = () => {
        const newErrors = {};
        
        const dateValidation = validateDate(formData.date);
        if (!dateValidation.isValid) newErrors.date = dateValidation.error;
        
        const timeValidation = validateTime(formData.time, formData.date);
        if (!timeValidation.isValid) newErrors.time = timeValidation.error;
        
        const locationValidation = validateRequired(formData.location, 'Location');
        if (!locationValidation.isValid) newErrors.location = locationValidation.error;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        setLoading(true);
        try {
            // Your API call here
            await submitBooking(formData);
            showNotification('Booking created successfully!', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to create booking', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner overlay />;

    return (
        <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
            </div>
            {/* Similar fields for time and location */}
            <button type="submit" disabled={loading}>
                {loading ? <LoadingSpinner size="small" /> : 'Create Booking'}
            </button>
        </form>
    );
};

export default BookingForm; 