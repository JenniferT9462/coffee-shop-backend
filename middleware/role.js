const role = (requireRole) => {
    return (req, res, next) => {
        if (req.user.role !== requireRole) {
            return res.status(403).json({ error: 'Access denied.' });
        }
        next();
    }
};

module.exports = role;