import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingManager.css';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/api/bookings/user');
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load bookings');
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId, reason) => {
        try {
            await axios.post(`/api/bookings/${bookingId}/cancel`, { reason });
            fetchBookings(); // Refresh the list
        } catch (err) {
            setError('Failed to cancel booking');
        }
    };

    const handleReschedule = async (bookingId, newDate, newTime) => {
        try {
            await axios.post(`/api/bookings/${bookingId}/reschedule`, {
                newDate,
                newTime
            });
            fetchBookings(); // Refresh the list
        } catch (err) {
            setError('Failed to reschedule booking');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="booking-manager">
            <h2>Your Bookings</h2>
            <div className="bookings-list">
                {bookings.map(booking => (
                    <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancel={handleCancel}
                        onReschedule={handleReschedule}
                    />
                ))}
            </div>
        </div>
    );
};

const BookingCard = ({ booking, onCancel, onReschedule }) => {
    const [showReschedule, setShowReschedule] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [cancelReason, setCancelReason] = useState('');

    return (
        <div className={`booking-card ${booking.status}`}>
            <div className="booking-details">
                <h3>Session on {new Date(booking.date).toLocaleDateString()}</h3>
                <p>Time: {booking.time}</p>
                <p>Location: {booking.location}</p>
                <p>Status: {booking.status}</p>
                {booking.waitlistPosition && (
                    <p>Waitlist Position: {booking.waitlistPosition}</p>
                )}
            </div>

            {booking.status === 'confirmed' && (
                <div className="booking-actions">
                    <button 
                        className="reschedule-btn"
                        onClick={() => setShowReschedule(!showReschedule)}
                    >
                        Reschedule
                    </button>
                    <button 
                        className="cancel-btn"
                        onClick={() => {
                            const reason = window.prompt('Please provide a reason for cancellation:');
                            if (reason) onCancel(booking._id, reason);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {showReschedule && (
                <div className="reschedule-form">
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                    />
                    <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            onReschedule(booking._id, newDate, newTime);
                            setShowReschedule(false);
                        }}
                    >
                        Confirm Reschedule
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingManager; 