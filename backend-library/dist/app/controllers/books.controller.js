"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const books_model_1 = require("../models/books.model");
const helpers_util_1 = require("../utils/helpers.util");
const zods_util_1 = require("../utils/zods.util");
const createBook = async (req, res, next) => {
    try {
        const zodBooks = await zods_util_1.zodBookSchema.parseAsync({
            ...req.body,
            createdBy: req.user?.id,
        });
        // console.log( "Validated Book Data:", zodBooks );
        const book = await books_model_1.Books.create(zodBooks);
        // console.log( "Book created successfully:", req.body, book );
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
            status: 201,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            const message = (0, helpers_util_1.isZodError)(error)
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
                status: 500,
                success: false,
                error,
                name: "UnknownError",
                stack: "No stack trace available",
            });
        }
    }
};
exports.createBook = createBook;
const getBooks = async (req, res) => {
    try {
        // console.log( "getBooks controller called with query:", req.query );
        const zodBody = await zods_util_1.zodFilterSchema.parseAsync(req.query);
        console.log("Validated Query Parameters:", zodBody);
        const filter = zodBody.filter;
        const sortBy = zodBody.sortBy || 'createdAt';
        const sort = zodBody.sort === 'desc' ? -1 : 1;
        const limit = parseInt(zodBody.limit) || 10;
        const page = parseInt(zodBody.page) || 1;
        // console.log(filter?.toUpperCase())
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        if (zodBody?.userId) {
            query.createdBy = zodBody?.userId;
        }
        const totalBooks = await books_model_1.Books.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limit);
        const skip = (page - 1) * limit;
        const books = await books_model_1.Books.find(query)
            .sort({ [sortBy]: sort })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email id");
        // const books = await Books.find( filter ? { genre: filter } : {} )
        //     .sort( { [ sortBy ]: sort } )
        //     .limit( limit ).populate("createdBy", "name email id");
        if (!books.length) {
            res.status(404).json({
                success: false,
                message: `${filter
                    ? `No books found for genre '${filter}'`
                    : zodBody?.userId
                        ? `No books found for this user`
                        : "No books found"}`,
                data: null,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
            meta: {
                total: totalBooks,
                page: page,
                limit: limit,
                totalPages,
            },
        });
    }
    catch (error) {
        // console.error( "Error in getBooks controller:", error.issues );
        if (error instanceof Error) {
            const message = (0, helpers_util_1.isZodError)(error)
                ? error.issues?.[0]?.message || "Validation error"
                : error.message;
            res.status(400).json({
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
                error: error,
                name: "UnknownError",
                stack: "No stack trace available"
            });
        }
    }
};
exports.getBooks = getBooks;
const getBookById = async (req, res, next) => {
    try {
        const bookId = req.params?.id;
        // console.log("getBookById controller called with ID:", bookId);
        const book = await books_model_1.Books.findById(bookId).populate("createdBy", "name email id");
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        // console.error( "Error in getBookById controller:", error );
        if (error instanceof Error) {
            res.status(400).json({
                message: error?.message,
                success: false,
                error: error instanceof Error ? error : "Unknown error", name: error.name,
                stack: error.stack
            });
        }
        else {
            res.status(500).json({
                message: "An unknown error occurred",
                success: false,
                error: error,
                name: "UnknownError",
                stack: "No stack trace available"
            });
        }
        // next(error);
    }
};
exports.getBookById = getBookById;
const updateBook = async (req, res, next) => {
    try {
        const bookId = req.params?.id;
        // console.log("updateBook controller called with ID:", bookId);
        const zodBooks = await zods_util_1.zodUpdateBookSchema.parseAsync(req.body);
        // console.log( "Validated Book Data for Update:", zodBooks );
        const book = await books_model_1.Books.findByIdAndUpdate(bookId, zodBooks, { new: true });
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    }
    catch (error) {
        if (error instanceof Error) {
            const message = (0, helpers_util_1.isZodError)(error)
                ? error.issues?.[0]?.message || "Validation error"
                : error.message;
            res.status(400).json({
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
                name: "UnknownError",
                stack: "No stack trace available",
            });
        }
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res, next) => {
    try {
        const bookId = req.params?.id;
        // const bookId = (req.params as { id: string }).id;
        // console.log("deleteBook controller called with ID:", bookId);
        const book = await books_model_1.Books.findByIdAndDelete(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        // console.error( "Error in deleteBook controller:", error );
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message,
                success: false,
                error: error instanceof Error ? error : "Unknown error",
                name: error.name,
                stack: error.stack
            });
        }
        else {
            res.status(500).json({
                message: "An unknown error occurred",
                success: false,
                error: error,
                name: "UnknownError",
                stack: "No stack trace available"
            });
        }
        // next(error);
    }
};
exports.deleteBook = deleteBook;
