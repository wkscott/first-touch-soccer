const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all active coaches (public)
router.get('/', async (req, res) => {
    try {
        const coaches = await Coach.find({ isActive: true })
            .select('-user')
            .sort({ name: 1 });
        res.json(coaches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch coaches' });
    }
});

// Get coach profile (for logged-in coach)
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const coach = await Coach.findOne({ user: req.user._id });
        if (!coach) {
            return res.status(404).json({ error: 'Coach profile not found' });
        }
        res.json(coach);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Create/Update coach profile
router.post('/profile', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        let coach = await Coach.findOne({ user: req.user._id });
        const profileData = {
            ...req.body,
            user: req.user._id,
            socialMedia: JSON.parse(req.body.socialMedia || '{}')
        };

        if (req.file) {
            profileData.profilePicture = `/uploads/${req.file.filename}`;
        }

        if (coach) {
            coach = await Coach.findOneAndUpdate(
                { user: req.user._id },
                profileData,
                { new: true }
            );
        } else {
            coach = await Coach.create(profileData);
        }

        res.json(coach);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get featured coaches
router.get('/featured', async (req, res) => {
    try {
        const featuredCoaches = await Coach.find({ 
            featured: true,
            isActive: true 
        }).limit(3);
        res.json(featuredCoaches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch featured coaches' });
    }
});

// Add/update review
router.post('/:id/reviews', isAuthenticated, async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);
        if (!coach) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        const review = {
            user: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment,
            date: new Date()
        };

        coach.reviews.push(review);
        await coach.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// Get coach availability
router.get('/:id/availability', async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);
        if (!coach) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        const date = new Date(req.query.date);
        const dayOfWeek = date.toLocaleLowerCase();
        
        const availability = coach.availability.filter(slot => 
            slot.dayOfWeek === dayOfWeek
        );

        res.json(availability);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

module.exports = router; 