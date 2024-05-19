const Joi = require('joi');

const PropertyValidationSchema = Joi.object({
    name: Joi.string().required(),
    place: Joi.string().required(),
    image: Joi.string().required(),
    area: Joi.number().required(),
    bedrooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
    hospitalsNearby: Joi.array().items(Joi.string()), // Array of strings
    collegesNearby: Joi.array().items(Joi.string()), // Array of strings
    likeCount: Joi.number().optional(), // Can be omitted during creation
});

module.exports = PropertyValidationSchema;
