import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfDay } from 'date-fns';
import axios from 'axios';

function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSessions, setAvailableSessions] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  // Time slots for training (2-hour blocks)
  const timeSlots = [
    '8:00 AM', '10:00 AM', '12:00 PM',
    '2:00 PM', '4:00 PM', '6:00 PM'
  ];

  // Fetch available sessions from the backend
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions/available');
        setAvailableSessions(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    fetchSessions();
  }, [selectedDate]);

  // Generate week view
  const generateWeekDays = () => {
    const startWeek = startOfWeek(selectedDate);
    return [...Array(7)].map((_, idx) => {
      const date = addDays(startWeek, idx);
      return date;
    });
  };

  // Book a session
  const handleBookSession = async () => {
    if (!selectedTime) return;

    try {
      // Replace with actual user ID from authentication
      const userId = 'user_id';
      await axios.put(`http://localhost:5000/api/sessions/${selectedTime}/book`, {
        player_id: userId
      });
      // Refresh available sessions
      const response = await axios.get('http://localhost:5000/api/sessions/available');
      setAvailableSessions(response.data);
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Schedule Training Session</h1>

        {/* Calendar Week View */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {generateWeekDays().map((date) => (
              <button
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={`p-4 text-center ${
                  startOfDay(date).getTime() === startOfDay(selectedDate).getTime()
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-blue-50'
                }`}
              >
                <div className="font-semibold">{format(date, 'EEE')}</div>
                <div>{format(date, 'MMM d')}</div>
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="divide-y divide-gray-200">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <span className="font-medium">{time}</span>
                <button
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleBookSession}
            disabled={!selectedTime}
            className={`px-6 py-3 rounded-lg ${
              selectedTime
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Book Session ($100)
          </button>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage; 