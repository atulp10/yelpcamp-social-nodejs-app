const express = require('express')
const app = express();

const router = express.Router({mergeParams:true});
// mergeParams:true, because both paths will not catch id otherwise.

const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utilities/CatchAsync');
const expressError = require('../utilities/ExpressError');

const {  validateReview,isLoggedIn,isReviewAuthor } = require('../middleware');

const reviews=require('../controllers/ReviewsController');

//Route handlers for reviews
router.post('/',isLoggedIn,validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports=router;