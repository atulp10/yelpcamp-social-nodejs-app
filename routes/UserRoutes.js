const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utilities/CatchAsync');

const { storeReturnTo } = require('../middleware');

const users = require('../controllers/UsersController');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.loginUser)

router.get('/logout', users.logoutUser)



module.exports = router;