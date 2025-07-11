"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRouter = void 0;
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("../controllers/books.controller");
const verifyUser_middleware_1 = require("../middlewares/verifyUser.middleware");
exports.booksRouter = express_1.default.Router();
exports.booksRouter.post("/", verifyUser_middleware_1.verifyAccessToken, books_controller_1.createBook);
exports.booksRouter.get("/", books_controller_1.getBooks);
exports.booksRouter.get("/:id", books_controller_1.getBookById);
exports.booksRouter.put("/:id", verifyUser_middleware_1.verifyAccessToken, books_controller_1.updateBook);
exports.booksRouter.delete("/:id", verifyUser_middleware_1.verifyAccessToken, books_controller_1.deleteBook);
