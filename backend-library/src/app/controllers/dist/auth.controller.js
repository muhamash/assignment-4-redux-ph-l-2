"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.logoutUser = exports.refreshToken = exports.login = exports.createUser = void 0;
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var session_model_1 = require("../models/session.model");
var user_model_1 = require("../models/user.model");
var helpers_util_1 = require("../utils/helpers.util");
var jwt_util_1 = require("../utils/jwt.util");
var zods_util_1 = require("../utils/zods.util");
exports.createUser = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var zodUser, user, error_1, message;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, zods_util_1.zodUserSchema.parseAsync(req.body)];
            case 1:
                zodUser = _c.sent();
                console.log(zodUser);
                return [4 /*yield*/, user_model_1.User.create(zodUser)];
            case 2:
                user = _c.sent();
                res.status(201).json({
                    success: true,
                    message: "user created successfully",
                    data: user,
                    status: 201
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                if (error_1 instanceof Error) {
                    message = helpers_util_1.isZodError(error_1) ? ((_b = (_a = error_1.issue) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) || "Validation error"
                        : error_1.message;
                    res.status(500).json({
                        message: message,
                        success: false,
                        error: __assign(__assign({ name: error_1.name }, error_1), { stack: error_1.stack })
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        status: 500,
                        success: false,
                        error: error_1,
                        name: "UnknownError",
                        stack: "No stack trace available"
                    });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var zodLogin, user, verifyUser, accessToken, refreshToken_1, expiresAt, accessTokenExpiresAt, error_2, message;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                return [4 /*yield*/, zods_util_1.zodLoginSchema.parseAsync(req.body)];
            case 1:
                zodLogin = _c.sent();
                return [4 /*yield*/, user_model_1.User.findOne({ email: zodLogin.email })];
            case 2:
                user = _c.sent();
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1["default"].compare(zodLogin.password, user.password)];
            case 3:
                verifyUser = _c.sent();
                if (!verifyUser) {
                    res.status(401).json({
                        success: false,
                        message: "Invalid credentials"
                    });
                    return [2 /*return*/];
                }
                accessToken = jwt_util_1.generateAccessToken(user.id);
                refreshToken_1 = jwt_util_1.generateRefreshToken(user.id);
                expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                accessTokenExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
                return [4 /*yield*/, session_model_1.Session.deleteMany({ user: user.id })];
            case 4:
                _c.sent();
                return [4 /*yield*/, session_model_1.Session.create({
                        user: user.id,
                        refreshToken: refreshToken_1,
                        expiresAt: expiresAt
                    })];
            case 5:
                _c.sent();
                res.cookie("refreshToken", refreshToken_1, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }).status(200).json({
                    success: true,
                    message: "Login successful",
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name
                        },
                        accessToken: accessToken,
                        accessTokenExpiresAt: accessTokenExpiresAt,
                        expire: "1 minute only"
                    }
                });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _c.sent();
                if (error_2 instanceof Error) {
                    message = helpers_util_1.isZodError(error_2) ? ((_b = (_a = error_2.issue) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) || "Validation error"
                        : error_2.message;
                    res.status(500).json({
                        message: message,
                        success: false,
                        error: __assign(__assign({ name: error_2.name }, error_2), { stack: error_2.stack })
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        status: 500,
                        success: false,
                        error: error_2,
                        name: "UnknownError",
                        stack: "No stack trace available"
                    });
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var refreshToken_2, session, payload, jwtError_1, user, newAccessToken, newRefreshToken, expiresAt, accessTokenExpiresAt, error_3, message;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 13, , 14]);
                console.log("Refresh token request received");
                console.log("Cookies:", req.cookies);
                if (!req.cookies.refreshToken) {
                    console.log("No refresh token found in cookies");
                    res.status(401).json({
                        success: false,
                        message: "No refresh token found in cookies"
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, zods_util_1.zodRefreshTokenSchema.parseAsync({
                        refreshToken: req.cookies.refreshToken
                    })];
            case 1:
                refreshToken_2 = (_c.sent()).refreshToken;
                console.log("Looking for session with refresh token:", refreshToken_2);
                return [4 /*yield*/, session_model_1.Session.findOne({ refreshToken: refreshToken_2 })];
            case 2:
                session = _c.sent();
                console.log("Found session:", session);
                if (!session) {
                    console.log("No session found for refresh token");
                    res.status(403).json({
                        success: false,
                        message: "Invalid session",
                        status: 403
                    });
                    return [2 /*return*/];
                }
                if (!(session.expiresAt && new Date() > session.expiresAt)) return [3 /*break*/, 4];
                console.log("Session has expired");
                return [4 /*yield*/, session_model_1.Session.findOneAndDelete({ refreshToken: refreshToken_2 })];
            case 3:
                _c.sent();
                res.status(403).json({
                    success: false,
                    message: "Session expired",
                    status: 403
                });
                return [2 /*return*/];
            case 4:
                payload = void 0;
                _c.label = 5;
            case 5:
                _c.trys.push([5, 6, , 8]);
                payload = jsonwebtoken_1["default"].verify(refreshToken_2, process.env.REFRESH_TOKEN_SECRET);
                console.log("JWT payload:", payload);
                return [3 /*break*/, 8];
            case 6:
                jwtError_1 = _c.sent();
                console.log("JWT verification failed:", jwtError_1);
                return [4 /*yield*/, session_model_1.Session.findOneAndDelete({ refreshToken: refreshToken_2 })];
            case 7:
                _c.sent();
                res.status(403).json({
                    success: false,
                    message: "Invalid refresh token",
                    status: 403
                });
                return [2 /*return*/];
            case 8: return [4 /*yield*/, user_model_1.User.findById(payload.id).select("-password")];
            case 9:
                user = _c.sent();
                if (!!user) return [3 /*break*/, 11];
                console.log("User not found for ID:", payload.id);
                return [4 /*yield*/, session_model_1.Session.findOneAndDelete({ refreshToken: refreshToken_2 })];
            case 10:
                _c.sent();
                res.status(403).json({
                    success: false,
                    message: "User not found",
                    status: 403
                });
                return [2 /*return*/];
            case 11:
                newAccessToken = jwt_util_1.generateAccessToken(payload.id);
                newRefreshToken = jwt_util_1.generateRefreshToken(payload.id);
                expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                accessTokenExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
                // Update the session with new refresh token
                return [4 /*yield*/, session_model_1.Session.findOneAndUpdate({ refreshToken: refreshToken_2 }, { refreshToken: newRefreshToken, expiresAt: expiresAt })];
            case 12:
                // Update the session with new refresh token
                _c.sent();
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production"
                }).status(200).json({
                    success: true,
                    message: "Access token successfully retrieved",
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name
                        },
                        accessToken: newAccessToken,
                        accessTokenExpiresAt: accessTokenExpiresAt,
                        expire: "1 minute only"
                    }
                });
                return [3 /*break*/, 14];
            case 13:
                error_3 = _c.sent();
                console.log("Refresh token error:", error_3);
                if (error_3 instanceof Error) {
                    message = error_3.name === "ZodError"
                        ? ((_b = (_a = error_3.issues) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) || "Validation error"
                        : error_3.message;
                    res.status(500).json({
                        message: message,
                        success: false,
                        error: __assign(__assign({ name: error_3.name }, error_3), { stack: error_3.stack })
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        success: false,
                        error: error_3
                    });
                }
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.logoutUser = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var refreshToken_3, session, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, zods_util_1.zodRefreshTokenSchema.parseAsync({
                        refreshToken: req.cookies.refreshToken
                    })];
            case 1:
                refreshToken_3 = (_a.sent()).refreshToken;
                return [4 /*yield*/, session_model_1.Session.findOne({ refreshToken: refreshToken_3 })];
            case 2:
                session = _a.sent();
                if (!session) {
                    res.status(403).json({ message: "Invalid session", status: 403 });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, session_model_1.Session.findOneAndDelete({ refreshToken: refreshToken_3 })];
            case 3:
                _a.sent();
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
                });
                res.status(200).json({
                    success: true,
                    message: "Logged out successfully"
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Logout error:", error_4);
                res.status(500).json({
                    success: false,
                    message: "An error occurred during logout"
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
