"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventOwnBorrow = void 0;
const books_model_1 = require("../models/books.model");
const preventOwnBorrow = async (req, res, next) => {
    try {
        const bookId = req.body.book;
        const userId = req.user.id;
        const book = await books_model_1.Books.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found", success: false, data: null });
        }
        // console.log( book );
        if (book.createdBy.toString() === userId) {
            return res.status(400).json({
                message: "You cannot borrow your own book",
                success: false
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.preventOwnBorrow = preventOwnBorrow;
