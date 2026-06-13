const express = require('express');
const router = express.Router();
const { upload } = require('../cloudinary/CloudinaryIndex');
const {
    isLoggedIn,
    isAuthor,
    validateCampground,
    validateObjectId,
} = require('../middleware');
const { protect } = require('../utilities/csrf');
const catchAsync = require('../utilities/CatchAsync');
const campgrounds = require('../controllers/CampgroundsControllers');

router.param('id', validateObjectId('id'));

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        upload.array('image', 6),
        protect,
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        upload.array('image', 6),
        protect,
        validateCampground,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, protect, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
