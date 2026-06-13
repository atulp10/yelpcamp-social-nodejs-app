const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { config } = require('../config/env');
const ExpressError = require('./ExpressError');

async function geocodeLocation(location) {
    if (!config.mapboxToken) {
        throw new ExpressError('Map service is not configured.', 503);
    }

    const geocoder = mbxGeocoding({ accessToken: config.mapboxToken });
    let response;
    try {
        response = await geocoder.forwardGeocode({ query: location, limit: 1 }).send();
    } catch (error) {
        throw new ExpressError('The map service is temporarily unavailable. Please try again.', 503);
    }
    const feature = response.body.features[0];

    if (!feature?.geometry?.coordinates) {
        throw new ExpressError('That location could not be found. Please enter a more specific location.', 400);
    }

    return feature.geometry;
}

module.exports = geocodeLocation;
