const express = require('express');
const passport = require('passport');
const { rateLimit } = require('express-rate-limit');
const catchAsync = require('../utilities/CatchAsync');
const { storeReturnTo, validateUser, isLoggedIn } = require('../middleware');
const { protect } = require('../utilities/csrf');
const users = require('../controllers/UsersController');

const router = express.Router();
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many authentication attempts. Please try again later.',
});

router.route('/register')
    .get(users.renderRegisterForm)
    .post(authLimiter, protect, validateUser, catchAsync(users.createUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(
        authLimiter,
        protect,
        storeReturnTo,
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/users/login',
        }),
        users.loginUser
    );

router.post('/logout', isLoggedIn, protect, users.logoutUser);

module.exports = router;
