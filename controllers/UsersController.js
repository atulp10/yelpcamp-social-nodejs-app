const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.createUser=async (req, res, next) => {
    try {
        //here added try-catch so that when a person registers trying
        // an already registered username, then he is redirected to 
        // /register page flashing the error message, instaed of catchAsync
        // handle the error and pass it to the next middleware rendering
        // the error page. 
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        // register(user, password, cb) Convenience method to register a new user instance
        // with a given password. Checks if username is unique. By passport-local-mongoose.
        // This method is available on User model as passport-local-mongoose is plugged in 
        // to userSchema.

        // req.login is used to keep a newly registered user logged in automatically. Otherwise, 
        // the user will have to login manually after registering. 
        // Passport exposes a login() function on req (also aliased as logIn()) that can be 
        // used to establish a login session.
        // When the login operation completes, newUser will be assigned to req.user.
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
// Passport exposes a logout() function on req (also aliased as logOut()) that can
// be called from any route handler which needs to terminate a login session. 
// Invoking logout() will remove the req.user property and clear the login session (if any).
// See Passport documentation or  google it.