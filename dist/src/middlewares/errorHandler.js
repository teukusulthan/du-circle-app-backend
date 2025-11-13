"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const appError_1 = require("../utils/appError");
function errorHandler(err, _req, res, _next) {
    if (err instanceof appError_1.AppError) {
        return res.status(err.code).json({
            code: err.code,
            status: "error",
            message: err.message,
        });
    }
    console.error(err);
    res.status(500).json({
        code: 500,
        status: "error",
        message: "Internal Server Error",
    });
}
