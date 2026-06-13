const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { campSchema, reviewSchema, userSchema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must log in first.');
        return res.redirect('/users/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
    next();
};

module.exports.validateObjectId = parameter => (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[parameter])) {
        return next(new ExpressError('Invalid resource identifier.', 400));
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const camp = await Campground.findById(req.params.id).select('author');
    if (!camp) return next(new ExpressError('The campground does not exist.', 404));
    if (!camp.author?.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to modify this campground.');
        return res.redirect(`/campgrounds/${camp._id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId).select('author');
    if (!review) return next(new ExpressError('The review does not exist.', 404));
    if (!review.author?.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to delete this review.');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
};

function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            const message = error.details.map(detail => detail.message).join(', ');
            return next(new ExpressError(message, 400));
        }
        req.body = value;
        next();
    };
}

module.exports.validateCampground = validate(campSchema);
module.exports.validateReview = validate(reviewSchema);
module.exports.validateUser = validate(userSchema);
