"use strict";
exports.__esModule = true;
exports.verifyAccessToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
exports.verifyAccessToken = function (req, res, next) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "No token provided",
                success: false
            });
            return;
        }
        var token = authHeader.split(" ")[1];
        var payload = jsonwebtoken_1["default"].verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { id: payload.id };
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
        return;
    }
};
