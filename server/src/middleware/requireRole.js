module.exports.requireRole = (...roles) => {
    return (req, res, next) => {
        const user = res.locals.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }

        next();
    };
};