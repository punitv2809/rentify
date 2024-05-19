const express = require('express');
const verifyToken = require('../middlewares/auth');
const verifySellerRole = require('../middlewares/sellerRole');
const PropertyValidationSchema = require('../validations/property');
const Property = require('../models/seller/property');
const router = express.Router();

router.post('/property', verifyToken, verifySellerRole, async (req, res) => {
    // Validate incoming property data
    const { error } = PropertyValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, image, place, area, bedrooms, bathrooms, hospitalsNearby, collegesNearby } = req.body;
    const userId = req.user.userId;

    // Create new property document
    const newProperty = new Property({
        name,
        image,
        place,
        area,
        bedrooms,
        bathrooms,
        hospitalsNearby,
        collegesNearby,
        userId,
    });

    try {
        const savedProperty = await newProperty.save();
        res.status(201).json({ message: 'Property created successfully', property: savedProperty });
    } catch (error) {
        console.error('Error saving property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/property', verifyToken, verifySellerRole, async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page and limit values

    try {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }, // Sort by creation date (latest first)
        };

        // Filter properties for the current seller
        const filter = { userId: req.user.userId };

        const sellerProperties = await Property.paginate(filter, options);

        res.status(200).json(sellerProperties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/property/:propertyId', verifyToken, verifySellerRole, async (req, res) => {
    const { propertyId } = req.params;

    try {
        // Find the property by ID
        const property = await Property.findById(propertyId).populate('userId', 'name email'); // Include user details

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.status(200).json(property); // Return the property data
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.patch('/property/:propertyId', verifyToken, verifySellerRole, async (req, res) => {
    const { propertyId } = req.params;
    const updates = req.body; // Property updates to be applied

    try {
        // Find property by ID
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Verify ownership using seller ID from token
        if (property.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized access. You can only modify your own properties.' });
        }

        // Get allowed property fields
        const allowedUpdates = Object.keys(Property.schema.paths);

        // Filter valid updates: handle single or multiple properties
        const validUpdates = Object.keys(updates).filter((update) => allowedUpdates.includes(update));
        validUpdates.forEach((update) => property.set(update, updates[update]));

        if (!validUpdates.length) {
            return res.status(400).json({ error: 'No valid updates provided' });
        }
        // Update property with allowed updates
        property.set(validUpdates, updates[validUpdates]);

        await property.save(); // Save updated property

        res.status(200).json({ message: 'Property updated successfully', property });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/property/:propertyId', verifyToken, verifySellerRole, async (req, res) => {
    const { propertyId } = req.params;

    try {
        // Find property by ID
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Verify ownership using seller ID from token
        if (property.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized access. You can only delete your own properties.' });
        }

        // Delete property
        await property.deleteOne();

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
