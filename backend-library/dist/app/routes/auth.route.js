"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/register", auth_controller_1.createUser);
exports.authRouter.post("/login", auth_controller_1.login);
exports.authRouter.post("/refresh-token", auth_controller_1.refreshToken);
exports.authRouter.post("/logout", auth_controller_1.logoutUser);
