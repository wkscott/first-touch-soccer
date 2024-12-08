import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({
        totalBookings: 0,
        confirmedBookings: 0,
        waitlistedBookings: 0,
        cancelledBookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, statsRes] = await Promise.all([
                axios.get('/api/admin/bookings'),
                axios.get('/api/admin/stats')
            ]);
            setBookings(bookingsRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await axios.put(`/api/admin/bookings/${bookingId}/status`, {
                status: newStatus
            });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const handleCapacityChange = async (date, time, capacity) => {
        try {
            await axios.put('/api/admin/capacity', {
                date,
                time,
                capacity
            });
            fetchData();
        } catch (error) {
            console.error('Error updating capacity:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-nav">
                <a href="/admin/dashboard" className="nav-link">Dashboard</a>
                <a href="/admin/users" className="nav-link">Users</a>
                <a href="/admin/bookings" className="nav-link">Bookings</a>
                <a href="/admin/analytics" className="nav-link">Analytics</a>
            </div>
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Bookings</h3>
                    <p>{stats.totalBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Confirmed</h3>
                    <p>{stats.confirmedBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Waitlisted</h3>
                    <p>{stats.waitlistedBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Cancelled</h3>
                    <p>{stats.cancelledBookings}</p>
                </div>
            </div>

            <div className="bookings-manager">
                <h2>Manage Bookings</h2>
                <div className="bookings-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <BookingRow 
                                    key={booking._id}
                                    booking={booking}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CapacityManager onCapacityChange={handleCapacityChange} />
        </div>
    );
};

const BookingRow = ({ booking, onStatusChange }) => {
    return (
        <tr>
            <td>{new Date(booking.date).toLocaleDateString()}</td>
            <td>{booking.time}</td>
            <td>{booking.user.name}</td>
            <td>
                <select
                    value={booking.status}
                    onChange={(e) => onStatusChange(booking._id, e.target.value)}
                >
                    <option value="confirmed">Confirmed</option>
                    <option value="waitlist">Waitlist</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </td>
            <td>{booking.location}</td>
            <td>
                <button onClick={() => window.location.href = `/admin/booking/${booking._id}`}>
                    View Details
                </button>
            </td>
        </tr>
    );
};

const CapacityManager = ({ onCapacityChange }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [capacity, setCapacity] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        onCapacityChange(date, time, capacity);
    };

    return (
        <div className="capacity-manager">
            <h2>Manage Capacity</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
                <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="1"
                    max="20"
                    required
                />
                <button type="submit">Update Capacity</button>
            </form>
        </div>
    );
};

export default AdminDashboard; 