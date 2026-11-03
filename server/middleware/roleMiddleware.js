function authorizeRoles(...allowedRoles) {
    return function (req, res, next) {
        // Check whether the user is logged in
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first."
            });
        }

        // Check whether the user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action."
            });
        }

        // User has permission, so continue
        next();
    };
}

module.exports = authorizeRoles;