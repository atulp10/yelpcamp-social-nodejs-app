const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.createUser=async (req, res) => {
    try {
        //here added try-catch so that when a person registers trying
        // an already registered username, then he is redirected to 
        // /register page flashing the error message, instaed of catchAsync
        // handle the error and pass it to the next middleware rendering
        // the error page. 
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);

        // req.login is used to keep a newly registered user logged in
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome, '+newUser.username+'!');
            //res.send(newUser);
            res.redirect('/campgrounds');
        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}

module.exports.renderLoginForm=(req, res) => {
    res.render('users/login');
}

module.exports.loginUser=(req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', req.user.username + '! You are logged in successfully!')
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req, res, next) => {
    req.logout(function (err) { // used for logout, Passport method on req object
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    })
}