function isAdmin(req, res, next) {
    // Check if user is logged in and is an admin
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    // If not admin, redirect to home page
    res.redirect('/');
}

module.exports = isAdmin; 