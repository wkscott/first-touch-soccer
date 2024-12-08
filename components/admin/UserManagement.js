import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, isActive) => {
        try {
            await axios.put(`/api/admin/users/${userId}/status`, {
                isActive
            });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleRoleChange = async (userId, isAdmin) => {
        try {
            await axios.put(`/api/admin/users/${userId}/role`, {
                isAdmin
            });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="user-management">
            <h2>User Management</h2>
            
            <div className="user-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.isAdmin ? 'admin' : 'user'}
                                        onChange={(e) => handleRoleChange(
                                            user._id,
                                            e.target.value === 'admin'
                                        )}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={user.isActive ? 'active' : 'inactive'}
                                        onChange={(e) => handleStatusChange(
                                            user._id,
                                            e.target.value === 'active'
                                        )}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowModal(true);
                                        }}
                                        className="view-details-btn"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setShowModal(false)}
                    onUpdate={fetchUsers}
                />
            )}
        </div>
    );
};

const UserDetailsModal = ({ user, onClose, onUpdate }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [user._id]);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`/api/admin/users/${user._id}/bookings`);
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>User Details</h3>
                <div className="user-info">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="user-bookings">
                    <h4>Booking History</h4>
                    {loading ? (
                        <p>Loading bookings...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                                        <td>{booking.time}</td>
                                        <td>{booking.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement; 