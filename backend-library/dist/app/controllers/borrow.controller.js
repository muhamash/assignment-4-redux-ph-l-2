"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowBooksSummary = exports.borrowABook = void 0;
const books_model_1 = require("../models/books.model");
const borrow_model_1 = require("../models/borrow.model");
const helpers_util_1 = require("../utils/helpers.util");
const zods_util_1 = require("../utils/zods.util");
const borrowABook = async (req, res) => {
    console.log("borrowABook controller called");
    try {
        console.log("Request Body:", req.body);
        const zodBook = await zods_util_1.zodBorrowSchema.parseAsync({
            ...req.body,
            user: req.user?.id
        });
        // console.log(zodBook)
        const updatedBook = await books_model_1.Books.adjustCopiesAfterBorrow(zodBook.book, zodBook.quantity);
        console.log("Validated Borrow Data:", zodBook, updatedBook);
        if (updatedBook) {
            const borrowedBook = await borrow_model_1.Borrow.create({
                ...req.body,
                user: req.user?.id
            });
            res.status(200).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrowedBook,
            });
        }
    }
    catch (error) {
        // console.log( error );
        if (error instanceof Error) {
            if (error.message === "Book not found") {
                res.status(404).json({
                    message: error.message,
                    success: false,
                    error: {
                        name: error.name,
                        ...error,
                        stack: error.stack,
                    },
                });
                return;
            }
            if (error.message === "Book is not available") {
                res.status(400).json({
                    message: error.message,
                    success: false,
                    error: {
                        name: error.name,
                        ...error,
                        stack: error.stack,
                    },
                });
                return;
            }
            if (error.message === "Not enough copies available") {
                res.status(400).json({
                    message: error.message,
                    success: false,
                    error: {
                        name: error.name,
                        ...error,
                        stack: error.stack,
                    },
                });
                return;
            }
            const message = (0, helpers_util_1.isZodError)(error)
                ? error.issues?.[0]?.message || "Validation error"
                : error.message;
            // console.log( message );
            res.status(500).json({
                message,
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
    }
};
exports.borrowABook = borrowABook;
const BorrowBooksSummary = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const basePipeline = [
            {
                $group: {
                    _id: {
                        book: '$book',
                        user: '$user'
                    },
                    userQuantity: { $sum: '$quantity' }
                }
            },
            {
                $group: {
                    _id: '$_id.book',
                    totalQuantity: { $sum: '$userQuantity' },
                    users: {
                        $push: {
                            userId: '$_id.user',
                            quantity: '$userQuantity'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            { $unwind: '$bookDetails' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'users.userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn'
                    },
                    totalQuantity: 1,
                    users: {
                        $map: {
                            input: '$users',
                            as: 'u',
                            in: {
                                id: '$$u.userId',
                                quantity: '$$u.quantity',
                                name: {
                                    $arrayElemAt: [
                                        {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: '$userDetails',
                                                        as: 'ud',
                                                        cond: { $eq: ['$$ud._id', '$$u.userId'] }
                                                    }
                                                },
                                                as: 'match',
                                                in: '$$match.name'
                                            }
                                        },
                                        0
                                    ]
                                },
                                email: {
                                    $arrayElemAt: [
                                        {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: '$userDetails',
                                                        as: 'ud',
                                                        cond: { $eq: ['$$ud._id', '$$u.userId'] }
                                                    }
                                                },
                                                as: 'match',
                                                in: '$$match.email'
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ];
        const totalResult = await borrow_model_1.Borrow.aggregate([
            ...basePipeline,
            { $count: 'total' }
        ]);
        const totalItems = totalResult[0]?.total || 0;
        const totalPages = Math.ceil(totalItems / limit);
        // Apply pagination
        const summary = await borrow_model_1.Borrow.aggregate([
            ...basePipeline,
            { $skip: skip },
            { $limit: limit }
        ]);
        if (summary.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No borrow records found, summary is empty',
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Borrow summary retrieved successfully',
            data: summary,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error,
                name: error.name,
                stack: error.stack
            });
        }
        else {
            res.status(500).json({
                message: 'An unknown error occurred',
                success: false,
                error,
                name: 'UnknownError',
                stack: 'No stack trace available'
            });
        }
    }
};
exports.BorrowBooksSummary = BorrowBooksSummary;
