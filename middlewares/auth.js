const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get authorization header and extract token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Remove 'Bearer ' prefix

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
        // Verify token and extract user data from payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object

        next(); // Proceed with the route handler if valid
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please login again' });
        } else {
            return res.status(403).json({ error: 'Invalid token' });
        }
    }
};

module.exports = verifyToken;
