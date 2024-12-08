import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import './CoachesList.css';
import StarRating from '../common/StarRating';

const CoachesList = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [featuredCoaches, setFeaturedCoaches] = useState([]);

    useEffect(() => {
        fetchCoaches();
        fetchFeaturedCoaches();
    }, []);

    const fetchCoaches = async () => {
        try {
            const response = await axios.get('/api/coaches');
            setCoaches(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coaches:', error);
            setLoading(false);
        }
    };

    const fetchFeaturedCoaches = async () => {
        try {
            const response = await axios.get('/api/coaches/featured');
            setFeaturedCoaches(response.data);
        } catch (error) {
            console.error('Error fetching featured coaches:', error);
        }
    };

    const filteredCoaches = coaches.filter(coach => 
        coach.name.toLowerCase().includes(filter.toLowerCase()) ||
        coach.specialties.some(specialty => 
            specialty.toLowerCase().includes(filter.toLowerCase())
        )
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="coaches-list">
            <h2>Our Coaches</h2>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name or specialty..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {featuredCoaches.length > 0 && (
                <div className="featured-coaches">
                    <h2>Featured Coaches</h2>
                    <div className="featured-coaches-grid">
                        {featuredCoaches.map(coach => (
                            <div key={coach._id} className="featured-coach-card">
                                <div className="featured-badge">Featured</div>
                                <img 
                                    src={coach.profilePicture} 
                                    alt={`${coach.name}'s profile`}
                                    className="coach-image"
                                />
                                <div className="coach-info">
                                    <h3>{coach.name}</h3>
                                    {coach.specialties.length > 0 && (
                                        <p className="specialties">
                                            {coach.specialties.join(', ')}
                                        </p>
                                    )}
                                    {coach.bio && (
                                        <p className="bio">{coach.bio}</p>
                                    )}
                                    <div className="contact-info">
                                        {coach.email && (
                                            <a href={`mailto:${coach.email}`} className="contact-link">
                                                Email
                                            </a>
                                        )}
                                        {coach.phone && (
                                            <a href={`tel:${coach.phone}`} className="contact-link">
                                                Call
                                            </a>
                                        )}
                                        {coach.venmoUsername && (
                                            <a 
                                                href={`https://venmo.com/${coach.venmoUsername}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="contact-link"
                                            >
                                                Venmo
                                            </a>
                                        )}
                                    </div>
                                    <div className="social-links">
                                        {Object.entries(coach.socialMedia).map(([platform, link]) => 
                                            link && (
                                                <a 
                                                    key={platform}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`social-link ${platform}`}
                                                >
                                                    {platform}
                                                </a>
                                            )
                                        )}
                                    </div>
                                    <div className="coach-rating">
                                        <StarRating rating={coach.averageRating} readonly />
                                        <span>({coach.totalReviews} reviews)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="coaches-grid">
                {filteredCoaches.map(coach => (
                    <div key={coach._id} className="coach-card">
                        <img 
                            src={coach.profilePicture} 
                            alt={`${coach.name}'s profile`}
                            className="coach-image"
                        />
                        <div className="coach-info">
                            <h3>{coach.name}</h3>
                            {coach.specialties.length > 0 && (
                                <p className="specialties">
                                    {coach.specialties.join(', ')}
                                </p>
                            )}
                            {coach.bio && (
                                <p className="bio">{coach.bio}</p>
                            )}
                            <div className="contact-info">
                                {coach.email && (
                                    <a href={`mailto:${coach.email}`} className="contact-link">
                                        Email
                                    </a>
                                )}
                                {coach.phone && (
                                    <a href={`tel:${coach.phone}`} className="contact-link">
                                        Call
                                    </a>
                                )}
                                {coach.venmoUsername && (
                                    <a 
                                        href={`https://venmo.com/${coach.venmoUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-link"
                                    >
                                        Venmo
                                    </a>
                                )}
                            </div>
                            <div className="social-links">
                                {Object.entries(coach.socialMedia).map(([platform, link]) => 
                                    link && (
                                        <a 
                                            key={platform}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`social-link ${platform}`}
                                        >
                                            {platform}
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoachesList; 