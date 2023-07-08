const Campground = require('./models/campground');
const Review = require('./models/review');
const { campSchema,reviewSchema } = require('./schemas');
const expressError = require('./utilities/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must log in first.');
        return res.redirect('/users/login');
    }
    next();
}
// isAuthenticated() is a method made by Passport on 'req' object.
// isLoggedIn middleware is used here in the routes to make sure
// that only a logged in user can edit/delete/create campgrounds.



module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
// This middleaware is created so that when a non-logged in user tries
// to update/create a campground, and he is redirected to login page,
// so when he logs in, he is redirected to the page he was opening i.e.
// edit or new campground page, insteading of redirecting to 
// 'all campgrounds' page.

module.exports.isAuthor = async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorised to edit this campground.');
        return res.redirect('/campgrounds/' + camp._id);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorised to edit this review.');
        return res.redirect('/campgrounds/' + req.params.id);
    }
    next();
}

// This function is for validating form data for an incoming
// new/edit form post request. It utilises Joi schemas.
module.exports.validateCampground = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

// This function is for validating form data for an incoming
// new/edit review post request
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}