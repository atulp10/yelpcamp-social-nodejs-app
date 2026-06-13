const mongoose = require('mongoose');
const Review = require('./review');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true, trim: true },
    filename: { type: String, required: true, trim: true },
}, { _id: false });

imageSchema.virtual('thumbnail').get(function () {
    return this.url.includes('/upload/')
        ? this.url.replace('/upload/', '/upload/w_240,h_160,c_fill/')
        : this.url;
});

const campgroundSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    price: { type: Number, required: true, min: 0, max: 10000 },
    images: {
        type: [imageSchema],
        validate: {
            validator: images => images.length <= 6,
            message: 'A campground can have at most 6 images.',
        },
        default: [],
    },
    description: { type: String, required: true, trim: true, minlength: 20, maxlength: 2000 },
    location: { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator(coordinates) {
                    return coordinates.length === 2
                        && coordinates.every(Number.isFinite)
                        && coordinates[0] >= -180 && coordinates[0] <= 180
                        && coordinates[1] >= -90 && coordinates[1] <= 90;
                },
                message: 'Geometry must contain valid longitude and latitude coordinates.',
            },
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

campgroundSchema.index({ geometry: '2dsphere' });

campgroundSchema.post('findOneAndDelete', async function (camp) {
    if (!camp) return;
    await Review.deleteMany({ _id: { $in: camp.reviews || [] } });
});

module.exports = mongoose.model('Campground', campgroundSchema);
