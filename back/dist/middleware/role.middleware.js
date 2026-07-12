"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            // return res.status(401).json({ message: "Unauthorized" });
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            // return res.status(403).json({ message: "Forbidden" });
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
