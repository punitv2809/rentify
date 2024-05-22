const express = require('express');
const verifyToken = require('../middlewares/auth');
const Property = require('../models/seller/property');
const router = express.Router();

function convertFilters(filters) {
    const filterObject = {};
    for (const key in filters) {
        // Check if the filter key matches a property schema field
        if (Property.schema.paths[key]) {
            const value = filters[key];
            const fieldType = Property.schema.paths[key].instance;

            // Convert value based on field type
            switch (fieldType) {
                case 'Number':
                    filterObject[key] = parseInt(value);
                    break;
                case 'Array':
                    filterObject[key] = { $in: value }; // Filter by multiple values in an array
                    break;
                case 'String':
                    // Use regex for case-insensitive string filtering
                    filterObject[key] = new RegExp(value, 'i');
                    break;
                default:
                    // Handle other data types if necessary
                    break;
            }
        }
    }
    return filterObject;
}


router.get('/property', verifyToken, async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query; // Extract pagination and filters

    try {
        // Convert filter values to Mongoose query operators (optional)
        const filterObject = convertFilters(filters); // Replace with your filter conversion logic
        console.log(filterObject); // Log for debugging (optional)

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }, // Sort by creation date (latest first)
        };
        // Build the query with filtering (if applicable)
        const properties = await Property.paginate(filterObject, options);

        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/property/:propertyId', verifyToken, async (req, res) => {
    const { propertyId } = req.params;

    try {
        // Find property by ID
        const property = await Property.findById(propertyId).select('-userId'); // Exclude userId from response

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/property/:propertyId/like', verifyToken, async (req, res) => {
    const { propertyId } = req.params; // Extract property ID from request parameters
    const userId = req.user.userId; // Assuming user ID is available from verified token

    try {
        // Find the property by ID
        const property = await Property.findByIdAndUpdate(propertyId, { $inc: { likeCount: 1 } }, { new: true }); // Update and return updated doc

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user has already liked the property (optional)
        // This check is not strictly necessary with the update approach
        // const alreadyLiked = property.likeCount > 0; // Assuming likeCount reflects user likes

        // Update successful, like count is incremented
        res.status(200).json({ message: 'Property liked successfully', likeCount: property.likeCount });
    } catch (error) {
        console.error('Error liking property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
