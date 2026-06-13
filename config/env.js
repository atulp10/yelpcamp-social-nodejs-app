const path = require('path');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction,
    port: Number(process.env.PORT) || 3000,
    dbUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp',
    secret: process.env.SECRET || (isProduction ? '' : 'development-only-secret'),
    mapboxToken: process.env.MAPBOX_TOKEN || '',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_KEY || '',
        apiSecret: process.env.CLOUDINARY_SECRET || '',
    },
};

function validateProductionConfig() {
    if (!isProduction) return;

    const missing = [];
    if (!process.env.DB_URL) missing.push('DB_URL');
    if (!process.env.SECRET) missing.push('SECRET');
    if (!process.env.MAPBOX_TOKEN) missing.push('MAPBOX_TOKEN');
    if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
    if (!process.env.CLOUDINARY_KEY) missing.push('CLOUDINARY_KEY');
    if (!process.env.CLOUDINARY_SECRET) missing.push('CLOUDINARY_SECRET');

    if (missing.length) {
        throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    }
}

module.exports = { config, validateProductionConfig };
