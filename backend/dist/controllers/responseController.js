"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (res, { statusCode = 500, message = "Internal server error!" }) => {
    return res.status(statusCode).json({
        status: "Failed",
        message,
    });
};
exports.errorResponse = errorResponse;
//todo: Success Response
const successResponse = (res, { statusCode = 200, message = "Successful", payload = {} }) => {
    return res.status(statusCode).json({
        status: "Success",
        message,
        payload,
    });
};
exports.successResponse = successResponse;
