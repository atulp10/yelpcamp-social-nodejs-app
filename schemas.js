// JOIschemas , not mongoose schemas here.

const BaseJoi = require('joi');

// This package is used to sanitize HTML. It won't let any non-allowed 
// tags pass through the input validation.
const sanitizeHtml = require('sanitize-html');


// Joi does not have its own HTML escaping feauture. But, it allows 
// to create extensoins, through which HTML sanitization can be performed.
// So, here an extension is created, which uses sanitize-html package
// and validates HTML inputs. If passed, it returns inputs as it is;
// otherwise returns an error message as specified.
// Here, escapeHTML() method will perform validation on 'String' or
// 'text' inputs.
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.campSchema = Joi.object({
    campground:Joi.object({
        title:Joi.string().required().escapeHTML(),
        location:Joi.string().required().escapeHTML(),
        description:Joi.string().required().escapeHTML(),
        price:Joi.number().required().min(0),
        //image:Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        body:Joi.string().required().escapeHTML(),
        rating:Joi.number().required().min(1).max(5),
    }).required()
})

