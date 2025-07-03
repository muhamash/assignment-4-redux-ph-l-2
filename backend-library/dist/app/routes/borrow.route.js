"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRouter = void 0;
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("../controllers/borrow.controller");
const preventOwnBorrow_middleware_1 = require("../middlewares/preventOwnBorrow.middleware");
const verifyUser_middleware_1 = require("../middlewares/verifyUser.middleware");
exports.borrowRouter = express_1.default.Router();
exports.borrowRouter.post("/", verifyUser_middleware_1.verifyAccessToken, preventOwnBorrow_middleware_1.preventOwnBorrow, borrow_controller_1.borrowABook);
exports.borrowRouter.get("/", verifyUser_middleware_1.verifyAccessToken, borrow_controller_1.BorrowBooksSummary);
