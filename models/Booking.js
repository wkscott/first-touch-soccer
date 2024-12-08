const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'rescheduled', 'waitlist'],
        default: 'confirmed'
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        default: 1
    },
    originalBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    cancellationReason: String,
    cancellationDate: Date,
    waitlistPosition: Number,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 