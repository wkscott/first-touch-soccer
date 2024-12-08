const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendEmail } = require('../utils/emailService');
const { scheduleReminders } = require('../utils/schedulerService');
const { isAuthenticated } = require('../middleware/auth');

// Create booking with waitlist support
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { date, time, location } = req.body;

        // Check existing bookings for this time slot
        const existingBookings = await Booking.countDocuments({
            date,
            time,
            status: 'confirmed'
        });

        const MAX_CAPACITY = 5; // Set your max capacity
        const status = existingBookings >= MAX_CAPACITY ? 'waitlist' : 'confirmed';
        
        const booking = new Booking({
            user: req.user._id,
            date,
            time,
            location,
            status
        });

        if (status === 'waitlist') {
            // Get waitlist position
            const waitlistCount = await Booking.countDocuments({
                date,
                time,
                status: 'waitlist'
            });
            booking.waitlistPosition = waitlistCount + 1;
        }

        await booking.save();

        // Schedule reminders only for confirmed bookings
        if (status === 'confirmed') {
            await scheduleReminders(booking, req.user.email, req.user.name);
        }

        // Send appropriate email
        const emailTemplate = status === 'confirmed' ? 
            'bookingConfirmation' : 'waitlistConfirmation';
        
        await sendEmail(
            req.user.email,
            emailTemplate,
            {
                userName: req.user.name,
                details: {
                    date: booking.date,
                    time: booking.time,
                    location: booking.location,
                    waitlistPosition: booking.waitlistPosition
                }
            }
        );

        res.status(200).json({ booking, message: `Booking ${status}` });
    } catch (error) {
        res.status(500).json({ error: 'Booking failed' });
    }
});

// Cancel booking
router.post('/:id/cancel', isAuthenticated, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        booking.status = 'cancelled';
        booking.cancellationReason = req.body.reason;
        booking.cancellationDate = new Date();
        await booking.save();

        // Process waitlist if there are any waitlisted bookings
        const waitlistedBooking = await Booking.findOne({
            date: booking.date,
            time: booking.time,
            status: 'waitlist'
        }).sort('waitlistPosition');

        if (waitlistedBooking) {
            waitlistedBooking.status = 'confirmed';
            waitlistedBooking.waitlistPosition = null;
            await waitlistedBooking.save();

            // Notify promoted user
            await sendEmail(
                waitlistedBooking.user.email,
                'bookingPromoted',
                {
                    userName: waitlistedBooking.user.name,
                    details: waitlistedBooking
                }
            );
        }

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Cancellation failed' });
    }
});

// Reschedule booking
router.post('/:id/reschedule', isAuthenticated, async (req, res) => {
    try {
        const { newDate, newTime } = req.body;
        const originalBooking = await Booking.findById(req.params.id);

        if (!originalBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (originalBooking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Create new booking
        const newBooking = new Booking({
            user: req.user._id,
            date: newDate,
            time: newTime,
            location: originalBooking.location,
            originalBooking: originalBooking._id
        });

        // Update original booking
        originalBooking.status = 'rescheduled';
        await originalBooking.save();
        await newBooking.save();

        // Schedule new reminders
        await scheduleReminders(newBooking, req.user.email, req.user.name);

        res.status(200).json({ 
            message: 'Booking rescheduled successfully',
            newBooking 
        });
    } catch (error) {
        res.status(500).json({ error: 'Rescheduling failed' });
    }
});

module.exports = router; 