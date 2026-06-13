const Campground = require('../models/campground');
const { uploadImage, destroyImages } = require('../cloudinary/CloudinaryIndex');
const geocodeLocation = require('../utilities/geocode');
const serialize = require('../utilities/serialize');
const ExpressError = require('../utilities/ExpressError');

const PAGE_SIZE = 10;

module.exports.index = async (req, res) => {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const totalCampgrounds = await Campground.countDocuments();
    const totalPages = Math.max(1, Math.ceil(totalCampgrounds / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const [camps, mapCamps] = await Promise.all([
        Campground.find({})
            .sort({ createdAt: -1, _id: -1 })
            .skip((currentPage - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .select('title location price images author')
            .lean(),
        Campground.find({ 'geometry.coordinates.1': { $exists: true } })
            .select('title location geometry')
            .lean(),
    ]);

    const mapData = {
        type: 'FeatureCollection',
        features: mapCamps.map(camp => ({
            type: 'Feature',
            geometry: camp.geometry,
            properties: {
                id: String(camp._id),
                title: camp.title,
                location: camp.location,
            },
        })),
    };

    res.render('campgrounds/index', {
        camps,
        mapDataJson: serialize(mapData),
        pagination: { currentPage, totalPages, totalCampgrounds },
        usesMap: true,
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.showCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author');

    if (!camp) {
        req.flash('error', 'The campground does not exist.');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', {
        camp,
        campgroundJson: serialize({
            title: camp.title,
            location: camp.location,
            geometry: camp.geometry,
        }),
        usesMap: true,
    });
};

module.exports.createCampground = async (req, res) => {
    const geometry = await geocodeLocation(req.body.campground.location);
    const uploadedImages = [];

    try {
        for (const file of req.files || []) uploadedImages.push(await uploadImage(file));

        const camp = new Campground({
            ...req.body.campground,
            geometry,
            images: uploadedImages,
            author: req.user._id,
        });
        await camp.save();
        req.flash('success', 'Successfully created a new campground.');
        res.redirect(`/campgrounds/${camp._id}`);
    } catch (error) {
        await destroyImages(uploadedImages.map(image => image.filename));
        throw error;
    }
};

module.exports.renderEditForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'The campground does not exist.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
};

module.exports.updateCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) throw new ExpressError('The campground does not exist.', 404);

    const requestedDeletions = Array.isArray(req.body.deleteImages)
        ? req.body.deleteImages
        : req.body.deleteImages ? [req.body.deleteImages] : [];
    const ownedFilenames = new Set(camp.images.map(image => image.filename));
    if (requestedDeletions.some(filename => !ownedFilenames.has(filename))) {
        throw new ExpressError('One or more selected images do not belong to this campground.', 400);
    }

    const remainingImageCount = camp.images.length - requestedDeletions.length;
    if (remainingImageCount + (req.files?.length || 0) > 6) {
        throw new ExpressError('A campground can have at most 6 images.', 400);
    }

    const newLocation = req.body.campground.location;
    const geometry = newLocation !== camp.location ? await geocodeLocation(newLocation) : camp.geometry;
    const uploadedImages = [];

    try {
        for (const file of req.files || []) uploadedImages.push(await uploadImage(file));

        Object.assign(camp, req.body.campground, { geometry });
        camp.images = camp.images.filter(image => !requestedDeletions.includes(image.filename));
        camp.images.push(...uploadedImages);
        await camp.save();
    } catch (error) {
        await destroyImages(uploadedImages.map(image => image.filename));
        throw error;
    }

    await destroyImages(requestedDeletions);
    req.flash('success', 'Successfully updated the campground.');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    if (!camp) throw new ExpressError('The campground does not exist.', 404);

    await destroyImages(camp.images.map(image => image.filename));
    req.flash('success', 'Successfully deleted the campground.');
    res.redirect('/campgrounds');
};
