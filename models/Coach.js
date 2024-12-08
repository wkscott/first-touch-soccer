const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxLength: 500
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const availabilitySchema = new mongoose.Schema({
    dayOfWeek: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
    },
    startTime: String,
    endTime: String,
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const coachSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        default: '/images/default-profile.png'
    },
    venmoUsername: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false,
        maxLength: 500
    },
    specialties: [{
        type: String
    }],
    reviews: [reviewSchema],
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    availability: [availabilitySchema],
    achievements: [{
        title: String,
        year: Number,
        description: String
    }],
    certifications: [{
        name: String,
        issuer: String,
        year: Number,
        expiryDate: Date
    }],
    experience: {
        type: Number,
        min: 0
    },
    hourlyRate: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    socialMedia: {
        instagram: String,
        twitter: String,
        facebook: String
    }
}, { timestamps: true });

// Calculate average rating when a review is added
coachSchema.pre('save', function(next) {
    if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = totalRating / this.reviews.length;
        this.totalReviews = this.reviews.length;
    }
    next();
});

module.exports = mongoose.model('Coach', coachSchema); 