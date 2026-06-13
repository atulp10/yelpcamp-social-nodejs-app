const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');

module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) throw new ExpressError('The campground does not exist.', 404);

    const review = new Review({ ...req.body.review, author: req.user._id });
    await review.save();

    try {
        camp.reviews.push(review._id);
        await camp.save();
    } catch (error) {
        await Review.findByIdAndDelete(review._id);
        throw error;
    }

    req.flash('success', 'Created a new review.');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const camp = await Campground.findOne({ _id: req.params.id, reviews: req.params.reviewId });
    if (!camp) throw new ExpressError('That review does not belong to this campground.', 404);

    await Promise.all([
        Campground.findByIdAndUpdate(camp._id, { $pull: { reviews: req.params.reviewId } }),
        Review.findByIdAndDelete(req.params.reviewId),
    ]);

    req.flash('success', 'Deleted the review.');
    res.redirect(`/campgrounds/${req.params.id}`);
};
