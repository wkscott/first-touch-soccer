import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './CoachProfileForm.css';

const CoachProfileForm = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        venmoUsername: '',
        bio: '',
        specialties: [],
        availability: '',
        socialMedia: {
            instagram: '',
            twitter: '',
            facebook: ''
        }
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/coach/profile');
            if (response.data) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            Object.keys(profile).forEach(key => {
                if (key === 'socialMedia') {
                    formData.append(key, JSON.stringify(profile[key]));
                } else {
                    formData.append(key, profile[key]);
                }
            });
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            await axios.post('/api/coach/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showNotification('Profile updated successfully!', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <form onSubmit={handleSubmit} className="coach-profile-form">
            <h2>Coach Profile</h2>

            <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                    type="text"
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label htmlFor="venmo">Venmo Username</label>
                <input
                    type="text"
                    id="venmo"
                    value={profile.venmoUsername}
                    onChange={(e) => setProfile({...profile, venmoUsername: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    maxLength="500"
                />
            </div>

            <div className="form-group">
                <label htmlFor="specialties">Specialties</label>
                <select
                    id="specialties"
                    value={profile.specialties}
                    onChange={(e) => setProfile({...profile, specialties: e.target.value})}
                    multiple
                >
                    <option value="Personal Training">Personal Training</option>
                    <option value="Group Training">Group Training</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Crossfit">Crossfit</option>
                    <option value="Boxing">Boxing</option>
                    <option value="Martial Arts">Martial Arts</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <select
                    id="availability"
                    value={profile.availability}
                    onChange={(e) => setProfile({...profile, availability: e.target.value})}
                >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Weekend">Weekend</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="socialMedia">Social Media</label>
                <div className="social-media-fields">
                    <div className="form-group">
                        <label htmlFor="instagram">Instagram</label>
                        <input
                            type="text"
                            id="instagram"
                            value={profile.socialMedia.instagram}
                            onChange={(e) => setProfile({...profile, socialMedia: {...profile.socialMedia, instagram: e.target.value}})}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="twitter">Twitter</label>
                        <input
                            type="text"
                            id="twitter"
                            value={profile.socialMedia.twitter}
                            onChange={(e) => setProfile({...profile, socialMedia: {...profile.socialMedia, twitter: e.target.value}})}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="facebook">Facebook</label>
                        <input
                            type="text"
                            id="facebook"
                            value={profile.socialMedia.facebook}
                            onChange={(e) => setProfile({...profile, socialMedia: {...profile.socialMedia, facebook: e.target.value}})}
                        />
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary">
                Update Profile
            </button>
        </form>
    );
};

export default CoachProfileForm; 