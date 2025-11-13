"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../utils/jwt");
const appError_1 = require("../utils/appError");
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer")) {
        throw new appError_1.AppError(401, "No token");
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(header.slice(7));
        req.user = decoded;
        next();
    }
    catch {
        throw new appError_1.AppError(401, "Invalid or exppired token");
    }
}
