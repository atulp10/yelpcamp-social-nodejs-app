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
    // passport.authenticate() checks for correct username and password, if wrong, then it flashes
    // an error message and redirects to /login page.
    // Here, it requires to pass the strategy used in the authenticate() method, that is 'local'
    // in this case. We can have different routes for google, facebook, twitter authentication.
    // passport.authenticate() middleware invokes req.login() automatically.
    // 'storeReturnTo' middleware is used here first to redirect back a logging in user
    // on the page he had initially requested. For example, when a non-logged in user requests 'new 
    // campground' page, firstly 'isLoggedIn' middleware will run. That will generate a req.session.returnTo
    // variable before redirecting to the login page. That req.session.returnTo variable is stored in
    // req.locals.returnTo variable in 'storeReturnTo' middleware. Finally, req.locals.returnTo is set as 
    // 'redirectUrl' in 'loginUser' function. 

router.get('/logout', users.logoutUser)



module.exports = router;