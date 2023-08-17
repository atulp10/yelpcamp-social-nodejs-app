const express = require('express')
const app = express();

const router = express.Router();

const Campground = require('../models/campground');

const { storage } = require('../cloudinary/CloudinaryIndex');

const multer = require('multer');
// Multer is a node.js middleware for handling multipart/form-data, 
// which is primarily used for uploading files.
// NOTE: Multer will not process any form which is not multipart 
// enctype='multipart/form-data'.

const upload = multer({ storage });
// uploaded files are stored in the place defined in 'storage'.


// isLoggedIn middleware is used here in the routes to make sure
// that only a logged in user can edit/delete/create campgrounds.
// isAuthor is used so that no one can edit campgrounds via Postman
// and such softwares.
// validateCampground is for validating form data for an incoming
// new/edit form post request. It utilises Joi schemas.
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const catchAsync = require('../utilities/CatchAsync');

const campgrounds = require('../controllers/CampgroundsControllers');







// Route handlers for campgrounds

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // middlewares are executed in sequence here. First 'isLogedIn' is run, if no error, then 'validateCampground'
    // and 'upload' is run, then 'createCampground' is run.
    //'isLoggedIn' is added in post route to assure that new campground can not be posted by an unauthorized person
    // by means of third party tools like postman.

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))







module.exports = router;