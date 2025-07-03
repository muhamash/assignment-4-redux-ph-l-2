"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAccessToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "No token provided",
                success: false,
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { id: payload.id };
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Invalid or expired token",
            success: false,
        });
        return;
    }
};
exports.verifyAccessToken = verifyAccessToken;
