const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserValidationSchema, UserLoginSchema } = require('../validations/user');

router.post('/', async (req, res) => {
    console.log(req.body);
    const { error } = UserValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    try {
        // Check if user with email already exists
        const existingUser = await User.alreadyExists(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email address already in use' });
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            role,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        // Joi validation
        const { error } = UserLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        console.log(user);
        // Compare password hashes
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const payload = { userId: user._id, role: user.role }; // Add role to payload
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_IN || '1d',
        });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
