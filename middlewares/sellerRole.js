const verifySellerRole = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ error: 'Buyer cannot create property' });
    }
    next();
};

module.exports = verifySellerRole;