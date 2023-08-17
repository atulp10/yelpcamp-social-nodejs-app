const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/CloudinaryIndex');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.showCampground = async (req, res, next) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author').populate('images');
    if (!camp) {
        req.flash('error', 'The campground does not exist.');
        return res.redirect('/campgrounds');
    }
    //console.log(camp);
    res.render('campgrounds/show', { camp });
}

module.exports.createCampground = async (req, res, next) => {



    const camp = new Campground(req.body.campground);
    // req.files is set bu multer. multer parses form-data that includes
    // files. A form should have attribute 'encrypted' set to 'multipart/form-data'
    // to send a file. multer than parses this form data and sets that to req.body
    // and req.file or req.files.
    // Using multer-storage-cloudinary package's functionality, the file sent via 
    // form is uploaded to cloudinary storage, and cloudinary returns that store 
    // file's path and filename which is stored in req.file or req.files object.
    // That is then used to retrieve those uploaded files.
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    // Now, we want to store geographic location of the campground.
    // So, we need to use forwardGeocode() method where we pass location 
    // data from req.body in query.
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    //console.log(geoData.body.features[0].geometry.coordinates);
    camp.geometry = geoData.body.features[0].geometry;
    console.log(camp.geometry);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground.');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.renderEditForm = async (req, res, next) => {

    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'The campground does not exist.');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit.ejs', { camp })
}

module.exports.updateCampground = async (req, res, next) => {

    const camp = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
    //console.log(req.body);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    // imgs is an array of object and camp.images is also an array of objects.
    // So, to push objects in camp.images, used the spread operator(...).
    // (otherwise, the array will be pushed.)
    camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
            // deleting images from cloudinary.
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // deleting images data of selected filenames from database.
    }
    req.flash('success', 'Successfully updated the campground.');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground.');
    res.redirect('/campgrounds');
}