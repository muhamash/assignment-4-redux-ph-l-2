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
exports.BorrowBooksSummary = exports.borrowABook = void 0;
var books_model_1 = require("../models/books.model");
var borrow_model_1 = require("../models/borrow.model");
var helpers_util_1 = require("../utils/helpers.util");
var zods_util_1 = require("../utils/zods.util");
exports.borrowABook = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var zodBook, updatedBook, borrowedBook, error_1, message;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log("borrowABook controller called");
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 7]);
                console.log("Request Body:", req.body);
                return [4 /*yield*/, zods_util_1.zodBorrowSchema.parseAsync(__assign(__assign({}, req.body), { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }))];
            case 2:
                zodBook = _e.sent();
                return [4 /*yield*/, books_model_1.Books.adjustCopiesAfterBorrow(zodBook.book, zodBook.quantity)];
            case 3:
                updatedBook = _e.sent();
                console.log("Validated Borrow Data:", zodBook, updatedBook);
                if (!updatedBook) return [3 /*break*/, 5];
                return [4 /*yield*/, borrow_model_1.Borrow.create(__assign(__assign({}, req.body), { user: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }))];
            case 4:
                borrowedBook = _e.sent();
                res.status(200).json({
                    success: true,
                    message: "Book borrowed successfully",
                    data: borrowedBook
                });
                _e.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _e.sent();
                // console.log( error );
                if (error_1 instanceof Error) {
                    if (error_1.message === "Book not found") {
                        res.status(404).json({
                            message: error_1.message,
                            success: false,
                            error: __assign(__assign({ name: error_1.name }, error_1), { stack: error_1.stack })
                        });
                        return [2 /*return*/];
                    }
                    if (error_1.message === "Book is not available") {
                        res.status(400).json({
                            message: error_1.message,
                            success: false,
                            error: __assign(__assign({ name: error_1.name }, error_1), { stack: error_1.stack })
                        });
                        return [2 /*return*/];
                    }
                    if (error_1.message === "Not enough copies available") {
                        res.status(400).json({
                            message: error_1.message,
                            success: false,
                            error: __assign(__assign({ name: error_1.name }, error_1), { stack: error_1.stack })
                        });
                        return [2 /*return*/];
                    }
                    message = helpers_util_1.isZodError(error_1)
                        ? ((_d = (_c = error_1.issues) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || "Validation error"
                        : error_1.message;
                    // console.log( message );
                    res.status(500).json({
                        message: message,
                        success: false,
                        error: error_1 instanceof Error ? error_1 : "Unknown error",
                        name: error_1.name,
                        stack: error_1.stack
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        success: false,
                        error: error_1,
                        name: "UnknownError",
                        stack: "No stack trace available"
                    });
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.BorrowBooksSummary = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var summary, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, borrow_model_1.Borrow.aggregate([
                        // First group by book + user to get per-user quantity
                        {
                            $group: {
                                _id: {
                                    book: '$book',
                                    user: '$user'
                                },
                                userQuantity: { $sum: '$quantity' }
                            }
                        },
                        // Group again by book to gather all users
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
                        // Lookup book details
                        {
                            $lookup: {
                                from: 'books',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'bookDetails'
                            }
                        },
                        { $unwind: '$bookDetails' },
                        // Lookup user details
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'users.userId',
                                foreignField: '_id',
                                as: 'userDetails'
                            }
                        },
                        // Map user info
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
                                        "in": {
                                            id: '$$u.userId',
                                            quantity: '$$u.quantity',
                                            // find user detail matching userId
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
                                                            "in": '$$match.name'
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
                                                            "in": '$$match.email'
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
                    ])];
            case 1:
                summary = _a.sent();
                if (summary.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No borrow records found, summary is empty",
                        data: null
                    });
                    return [2 /*return*/];
                }
                res.status(200).json({
                    success: true,
                    message: "Borrow summary retrieved successfully",
                    data: summary
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                // console.error( "Error in BorrowBooksSummary controller:", error );
                if (error_2 instanceof Error) {
                    res.status(500).json({
                        message: (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || "Internal Server Error",
                        success: false,
                        error: error_2 instanceof Error ? error_2 : "Unknown error",
                        name: error_2.name,
                        stack: error_2.stack
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        success: false,
                        error: error_2,
                        name: "UnknownError",
                        stack: "No stack trace available"
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
