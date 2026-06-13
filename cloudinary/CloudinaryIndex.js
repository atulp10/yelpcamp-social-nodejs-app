const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { config } = require('../config/env');
const ExpressError = require('../utilities/ExpressError');

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 6,
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new ExpressError('Images must be JPEG, PNG, or WebP files.', 400));
        }
        callback(null, true);
    },
});

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: 'YelpCamp',
            resource_type: 'image',
            transformation: [
                { width: 1600, height: 1067, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        }, (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, filename: result.public_id });
        });

        stream.end(file.buffer);
    });
}

async function destroyImages(filenames = []) {
    const uniqueFilenames = [...new Set(filenames.filter(Boolean))];
    const results = await Promise.allSettled(
        uniqueFilenames.map(filename => cloudinary.uploader.destroy(filename, { resource_type: 'image' }))
    );

    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length) {
        console.error(`Failed to delete ${failures.length} Cloudinary image(s).`);
    }
    return results;
}

module.exports = { cloudinary, upload, uploadImage, destroyImages };
