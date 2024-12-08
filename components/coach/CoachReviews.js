import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import StarRating from '../common/StarRating';
import './CoachReviews.css';

const CoachReviews = ({ coachId, reviews, onReviewAdded }) => {
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/coaches/${coachId}/reviews`, newReview);
            showNotification('Review submitted successfully!', 'success');
            setNewReview({ rating: 5, comment: '' });
            setShowReviewForm(false);
            onReviewAdded(response.data);
        } catch (error) {
            showNotification(error.message || 'Failed to submit review', 'error');
        }
    };

    return (
        <div className="coach-reviews">
            <div className="reviews-header">
                <h3>Reviews ({reviews.length})</h3>
                <button 
                    className="write-review-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                >
                    Write a Review
                </button>
            </div>

            {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="review-form">
                    <StarRating
                        rating={newReview.rating}
                        onChange={(rating) => setNewReview({ ...newReview, rating })}
                    />
                    <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Write your review here..."
                        required
                        maxLength={500}
                    />
                    <button type="submit">Submit Review</button>
                </form>
            )}

            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                        <div className="review-header">
                            <StarRating rating={review.rating} readonly />
                            <span className="review-date">
                                {new Date(review.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoachReviews; 