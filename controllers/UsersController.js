const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => res.render('users/register');

module.exports.createUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email: email.toLowerCase(), username });
        const newUser = await User.register(user, password);

        req.login(newUser, error => {
            if (error) return next(error);
            req.flash('success', `Welcome, ${newUser.username}!`);
            res.redirect('/campgrounds');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/users/register');
    }
};

module.exports.renderLoginForm = (req, res) => res.render('users/login');

module.exports.loginUser = (req, res) => {
    const requestedUrl = res.locals.returnTo;
    const redirectUrl = requestedUrl?.startsWith('/') && !requestedUrl.startsWith('//')
        ? requestedUrl
        : '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', `${req.user.username}, you are logged in successfully!`);
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(error => {
        if (error) return next(error);
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};
