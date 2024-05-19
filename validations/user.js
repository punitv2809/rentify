const Joi = require('joi');

const UserValidationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .min(8) // Minimum 8 characters
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // Must include lowercase, uppercase, number, and special character
        .message('Password must be at least 8 characters and include lowercase, uppercase, number, and special character'),
    phoneNumber: Joi.string()
        .required()
        .length(10) // Exactly 10 digits
        .pattern(/^[0-9]+$/) // Only digits
        .message('Phone number must be a 10-digit number'),
    role: Joi.string().valid('seller', 'buyer').required(),
});

const UserLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    UserValidationSchema,
    UserLoginSchema
};