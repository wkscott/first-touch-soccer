const schedule = require('node-schedule');
const { sendEmail } = require('./emailService');
const Booking = require('../models/Booking');

// Schedule reminders for a specific booking
async function scheduleReminders(booking, userEmail, userName) {
    // Schedule 24-hour reminder
    const reminderDate = new Date(booking.date);
    reminderDate.setHours(reminderDate.getHours() - 24);
    
    schedule.scheduleJob(reminderDate, async () => {
        try {
            // Verify booking still exists and isn't cancelled
            const currentBooking = await Booking.findById(booking._id);
            if (currentBooking && !currentBooking.isCancelled) {
                await sendEmail(
                    userEmail,
                    'reminderEmail',
                    {
                        userName: userName,
                        details: {
                            date: booking.date,
                            time: booking.time,
                            location: booking.location
                        }
                    }
                );
                console.log(`Reminder email sent for booking ${booking._id}`);
            }
        } catch (error) {
            console.error('Failed to send reminder email:', error);
        }
    });
}

// Initialize reminders for all upcoming bookings
async function initializeReminders() {
    try {
        const upcomingBookings = await Booking.find({
            date: { $gt: new Date() },
            isCancelled: { $ne: true }
        }).populate('user');

        upcomingBookings.forEach(booking => {
            scheduleReminders(
                booking,
                booking.user.email,
                booking.user.name
            );
        });

        console.log(`Initialized reminders for ${upcomingBookings.length} bookings`);
    } catch (error) {
        console.error('Failed to initialize reminders:', error);
    }
}

module.exports = { scheduleReminders, initializeReminders }; 