import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile({ user }) {
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          ) : (
            <div className="default-avatar">{user.firstName?.charAt(0)}</div>
          )}
          <h2>{`${user.firstName} ${user.lastName}`}</h2>
        </div>
        
        <div className="profile-info">
          <div className="info-group">
            <label>Role:</label>
            <span>{user.role}</span>
          </div>
          {!user.isCoach && (
            <div className="info-group">
              <label>Grade:</label>
              <span>{user.grade}th Grade</span>
            </div>
          )}
          <div className="info-group">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-group">
            <label>Phone:</label>
            <span>{user.phone}</span>
          </div>
          <div className="info-group">
            <label>Birthday:</label>
            <span>{new Date(user.birthday).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 