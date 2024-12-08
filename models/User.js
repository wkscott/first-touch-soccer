const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // ... other fields ...
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema); 