const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = joi => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML',
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
                return clean === value ? clean : helpers.error('string.escapeHTML');
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);
const cleanString = (min, max) => Joi.string().trim().min(min).max(max).required().escapeHTML();

module.exports.campSchema = Joi.object({
    campground: Joi.object({
        title: cleanString(3, 100),
        location: cleanString(3, 150),
        description: cleanString(20, 2000),
        price: Joi.number().precision(2).min(0).max(10000).required(),
    }).required(),
    deleteImages: Joi.array().items(Joi.string().trim().max(300)).max(6).single(),
    _csrf: Joi.string().optional(),
}).unknown(false);

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: cleanString(2, 1000),
        rating: Joi.number().integer().min(1).max(5).required(),
    }).required(),
    _csrf: Joi.string().optional(),
}).unknown(false);

module.exports.userSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().max(254).required(),
    username: Joi.string().trim().min(3).max(30).pattern(/^[a-zA-Z0-9_-]+$/).required(),
    password: Joi.string().min(8).max(72).required(),
    _csrf: Joi.string().optional(),
}).unknown(false);
