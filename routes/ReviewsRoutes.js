const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/CatchAsync');
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor,
    validateObjectId,
} = require('../middleware');
const { protect } = require('../utilities/csrf');
const reviews = require('../controllers/ReviewsController');

router.use(validateObjectId('id'));
router.param('reviewId', validateObjectId('reviewId'));

router.post('/', isLoggedIn, protect, validateReview, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, protect, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
