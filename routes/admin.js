const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Get all bookings
router.get('/bookings', isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .sort({ date: 1, time: 1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get dashboard stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const [total, confirmed, waitlisted, cancelled] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' }),
            Booking.countDocuments({ status: 'waitlist' }),
            Booking.countDocuments({ status: 'cancelled' })
        ]);

        res.json({
            totalBookings: total,
            confirmedBookings: confirmed,
            waitlistedBookings: waitlisted,
            cancelledBookings: cancelled
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Update booking status
router.put('/bookings/:id/status', isAdmin, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// Update capacity for a time slot
router.put('/capacity', isAdmin, async (req, res) => {
    try {
        const { date, time, capacity } = req.body;
        // Implementation depends on how you store capacity
        // This is a placeholder
        res.json({ message: 'Capacity updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update capacity' });
    }
});

// Get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user details with bookings
router.get('/users/:id/bookings', isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.id })
            .sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
});

// Update user status
router.put('/users/:id/status', isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: req.body.isActive },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Update user role
router.put('/users/:id/role', isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isAdmin: req.body.isAdmin },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Get analytics data
router.get('/analytics', isAdmin, async (req, res) => {
    try {
        const timeframe = req.query.timeframe || 'month';
        const startDate = getStartDate(timeframe);

        // Fetch booking trends
        const bookingTrends = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    bookings: { 
                        $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
                    },
                    waitlist: { 
                        $sum: { $cond: [{ $eq: ["$status", "waitlist"] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Fetch revenue data
        const revenue = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Fetch user stats
        const userStats = {
            activeUsers: await User.countDocuments({ isActive: true }),
            newUsers: await User.countDocuments({ 
                createdAt: { $gte: startDate }
            }),
            repeatBookings: await calculateRepeatBookingRate(startDate),
            avgSessionsPerUser: await calculateAvgSessionsPerUser(startDate)
        };

        // Fetch location stats
        const locationStats = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: "confirmed"
                }
            },
            {
                $group: {
                    _id: "$location",
                    bookings: { $sum: 1 }
                }
            }
        ]);

        // Fetch time slot popularity
        const timeSlotPopularity = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: "confirmed"
                }
            },
            {
                $group: {
                    _id: "$time",
                    bookings: { $sum: 1 }
                }
            },
            {
                $sort: { "bookings": -1 }
            }
        ]);

        res.json({
            bookingTrends: formatBookingTrends(bookingTrends),
            revenue: formatRevenue(revenue),
            userStats,
            locationStats: formatLocationStats(locationStats),
            timeSlotPopularity: formatTimeSlotPopularity(timeSlotPopularity)
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});

// Helper functions
function getStartDate(timeframe) {
    const date = new Date();
    switch (timeframe) {
        case 'week':
            date.setDate(date.getDate() - 7);
            break;
        case 'month':
            date.setMonth(date.getMonth() - 1);
            break;
        case 'quarter':
            date.setMonth(date.getMonth() - 3);
            break;
        case 'year':
            date.setFullYear(date.getFullYear() - 1);
            break;
    }
    return date;
}

async function calculateRepeatBookingRate(startDate) {
    const totalUsers = await User.countDocuments();
    const usersWithMultipleBookings = await Booking.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: "$user",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $match: {
                bookingCount: { $gt: 1 }
            }
        },
        {
            $count: "count"
        }
    ]);

    return totalUsers > 0 ? 
        Math.round((usersWithMultipleBookings[0]?.count || 0) / totalUsers * 100) : 
        0;
}

async function calculateAvgSessionsPerUser(startDate) {
    const result = await Booking.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: "$user",
                sessionCount: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                totalSessions: { $sum: "$sessionCount" },
                totalUsers: { $sum: 1 }
            }
        },
        {
            $project: {
                avgSessionsPerUser: { $divide: ["$totalSessions", "$totalUsers"] }
            }
        }
    ]);

    return result[0]?.avgSessionsPerUser || 0;
}

module.exports = router; 