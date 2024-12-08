import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BookingCalendar.css';
import axios from 'axios';

const locales = {
    'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const BookingCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/api/bookings');
            const formattedEvents = response.data.map(booking => ({
                id: booking._id,
                title: `Session ${booking.status === 'waitlist' ? '(Waitlist)' : ''}`,
                start: new Date(booking.date + 'T' + booking.time),
                end: new Date(new Date(booking.date + 'T' + booking.time).getTime() + 60*60*1000), // 1 hour sessions
                status: booking.status,
                location: booking.location
            }));
            setEvents(formattedEvents);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const handleSelect = ({ start, end }) => {
        // Check if selected time is in the past
        if (start < new Date()) {
            alert("Cannot book sessions in the past");
            return;
        }

        setSelectedSlot({ start, end });
        setShowModal(true);
    };

    const handleBooking = async (bookingDetails) => {
        try {
            await axios.post('/api/bookings/create', {
                date: format(selectedSlot.start, 'yyyy-MM-dd'),
                time: format(selectedSlot.start, 'HH:mm'),
                location: bookingDetails.location
            });
            
            setShowModal(false);
            fetchBookings(); // Refresh calendar
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to create booking');
        }
    };

    if (loading) return <div>Loading calendar...</div>;

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectSlot={handleSelect}
                eventPropGetter={event => ({
                    className: `event-${event.status}`
                })}
                views={['month', 'week', 'day']}
                step={60}
                timeslots={1}
            />

            {showModal && (
                <BookingModal
                    slot={selectedSlot}
                    onClose={() => setShowModal(false)}
                    onBook={handleBooking}
                />
            )}
        </div>
    );
};

const BookingModal = ({ slot, onClose, onBook }) => {
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onBook({ location });
    };

    return (
        <div className="booking-modal">
            <div className="modal-content">
                <h2>Book Session</h2>
                <p>Date: {format(slot.start, 'MMMM dd, yyyy')}</p>
                <p>Time: {format(slot.start, 'h:mm a')}</p>
                
                <form onSubmit={handleSubmit}>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    >
                        <option value="">Select Location</option>
                        <option value="Field A">Field A</option>
                        <option value="Field B">Field B</option>
                        <option value="Indoor Facility">Indoor Facility</option>
                    </select>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Book Session</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingCalendar; 