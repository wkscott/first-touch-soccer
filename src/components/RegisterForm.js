import React, { useState } from 'react';
import './RegisterForm.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    grade: '',
    birthday: '',
    profileType: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registration</h2>
        
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade Level</label>
          <select
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="profileType">Profile Type</label>
          <select
            id="profileType"
            name="profileType"
            value={formData.profileType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Profile Type</option>
            <option value="coach">Coach</option>
            <option value="player">Player</option>
            <option value="parent">Parent</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="birthday">Birthday</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm; 