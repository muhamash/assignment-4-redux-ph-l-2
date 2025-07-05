"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshToken = exports.login = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const session_model_1 = require("../models/session.model");
const user_model_1 = require("../models/user.model");
const helpers_util_1 = require("../utils/helpers.util");
const jwt_util_1 = require("../utils/jwt.util");
const zods_util_1 = require("../utils/zods.util");
const createUser = async (req, res, next) => {
    try {
        const zodUser = await zods_util_1.zodUserSchema.parseAsync(req.body);
        console.log(zodUser);
        const user = await user_model_1.User.create(zodUser);
        res.status(201).json({
            success: true,
            message: "user created successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            const message = (0, helpers_util_1.isZodError)(error) ? error.issue?.[0]?.message || "Validation error"
                : error.message;
            res.status(500).json({
                message,
                success: false,
                error: {
                    name: error.name,
                    ...error,
                    stack: error.stack,
                },
            });
        }
        else {
            res.status(500).json({
                message: "An unknown error occurred",
                status: 500,
                success: false,
                error,
                name: "UnknownError",
                stack: "No stack trace available",
            });
        }
    }
};
exports.createUser = createUser;
const login = async (req, res, next) => {
    try {
        const zodLogin = await zods_util_1.zodLoginSchema.parseAsync(req.body);
        const user = await user_model_1.User.findOne({ email: zodLogin.email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const verifyUser = await bcryptjs_1.default.compare(zodLogin.password, user.password);
        if (!verifyUser) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        const accessToken = (0, jwt_util_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_util_1.generateRefreshToken)(user.id);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const accessTokenExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
        await session_model_1.Session.create({
            user: user.id,
            refreshToken,
            expiresAt
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                accessToken,
                accessTokenExpiresAt,
                expire: "2 mints only"
            },
        });
    }
    catch (error) {
        if (error instanceof Error) {
            const message = (0, helpers_util_1.isZodError)(error) ? error.issue?.[0]?.message || "Validation error"
                : error.message;
            res.status(500).json({
                message,
                success: false,
                error: {
                    name: error.name,
                    ...error,
                    stack: error.stack,
                },
            });
        }
        else {
            res.status(500).json({
                message: "An unknown error occurred",
                status: 500,
                success: false,
                error,
                name: "UnknownError",
                stack: "No stack trace available",
            });
        }
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.refreshToken) {
            res.status(401).json({ message: "No refresh token found in cookies" });
            return;
        }
        const { refreshToken } = await zods_util_1.zodRefreshTokenSchema.parseAsync({
            refreshToken: req.cookies.refreshToken,
        });
        const session = await session_model_1.Session.findOne({ refreshToken });
        if (!session) {
            res.status(403).json({ message: "Invalid session", status: 403 });
            return;
        }
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await user_model_1.User.findById(payload.id).select("-password");
        const newAccessToken = (0, jwt_util_1.generateAccessToken)(payload.id);
        const newRefreshToken = (0, jwt_util_1.generateRefreshToken)(payload.id);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const accessTokenExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
        await session_model_1.Session.findOneAndUpdate({ refreshToken }, { refreshToken: newRefreshToken, expiresAt });
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).status(200).json({
            success: true,
            message: "Access token successfully retrieved",
            data: {
                user,
                accessToken: newAccessToken,
                accessTokenExpiresAt,
                expire: "2 minutes only",
            },
        });
    }
    catch (error) {
        if (error instanceof Error) {
            const message = error.name === "ZodError"
                ? error.issues?.[0]?.message || "Validation error"
                : error.message;
            res.status(500).json({
                message,
                success: false,
                error: {
                    name: error.name,
                    ...error,
                    stack: error.stack,
                },
            });
        }
        else {
            res.status(500).json({
                message: "An unknown error occurred",
                success: false,
                error,
            });
        }
    }
};
exports.refreshToken = refreshToken;
const logoutUser = async (req, res, next) => {
    const { refreshToken } = await zods_util_1.zodRefreshTokenSchema.parseAsync({
        refreshToken: req.cookies.refreshToken,
    });
    const session = await session_model_1.Session.findOne({ refreshToken });
    if (!session) {
        res.status(403).json({ message: "Invalid session", status: 403 });
        return;
    }
    // await Session.findOneAndDelete( { refreshToken } );
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.status(204).send();
};
exports.logoutUser = logoutUser;
