import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import './AvailabilityCalendar.css';

const AvailabilityCalendar = ({ coachId, onTimeSlotSelect }) => {
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchAvailability();
    }, [coachId, selectedDate]);

    const fetchAvailability = async () => {
        try {
            const response = await axios.get(`/api/coaches/${coachId}/availability`, {
                params: {
                    date: selectedDate.toISOString()
                }
            });
            setAvailability(response.data);
            generateTimeSlots(response.data);
        } catch (error) {
            showNotification('Failed to fetch availability', 'error');
        }
    };

    const generateTimeSlots = (availabilityData) => {
        // Generate 30-minute slots based on availability
        const slots = [];
        availabilityData.forEach(slot => {
            const start = new Date(`${selectedDate.toDateString()} ${slot.startTime}`);
            const end = new Date(`${selectedDate.toDateString()} ${slot.endTime}`);
            
            while (start < end) {
                slots.push({
                    time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    available: slot.isAvailable
                });
                start.setMinutes(start.getMinutes() + 30);
            }
        });
        setTimeSlots(slots);
    };

    return (
        <div className="availability-calendar">
            <div className="calendar-header">
                <h3>Book a Session</h3>
                <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="time-slots">
                {timeSlots.map((slot, index) => (
                    <button
                        key={index}
                        className={`time-slot ${slot.available ? 'available' : 'unavailable'}`}
                        onClick={() => slot.available && onTimeSlotSelect(slot.time)}
                        disabled={!slot.available}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AvailabilityCalendar; 