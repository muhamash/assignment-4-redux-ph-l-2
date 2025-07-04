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
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
var books_model_1 = require("../models/books.model");
var helpers_util_1 = require("../utils/helpers.util");
var zods_util_1 = require("../utils/zods.util");
exports.createBook = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var zodBooks, book, error_1, message;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, zods_util_1.zodBookSchema.parseAsync(__assign(__assign({}, req.body), { createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }))];
            case 1:
                zodBooks = _d.sent();
                return [4 /*yield*/, books_model_1.Books.create(zodBooks)];
            case 2:
                book = _d.sent();
                // console.log( "Book created successfully:", req.body, book );
                res.status(201).json({
                    success: true,
                    message: "Book created successfully",
                    data: book,
                    status: 201
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                if (error_1 instanceof Error) {
                    message = helpers_util_1.isZodError(error_1)
                        ? ((_c = (_b = error_1.issues) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) || "Validation error"
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
exports.getBooks = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var zodBody, filter, sortBy, sort, limit, page, query, totalBooks, totalPages, skip, books, error_2, message;
    var _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                return [4 /*yield*/, zods_util_1.zodFilterSchema.parseAsync(req.query)];
            case 1:
                zodBody = _d.sent();
                console.log("Validated Query Parameters:", zodBody);
                filter = zodBody.filter;
                sortBy = zodBody.sortBy || 'createdAt';
                sort = zodBody.sort === 'desc' ? -1 : 1;
                limit = parseInt(zodBody.limit) || 10;
                page = parseInt(zodBody.page) || 1;
                query = {};
                if (filter) {
                    query.genre = filter;
                }
                if (zodBody === null || zodBody === void 0 ? void 0 : zodBody.userId) {
                    query.createdBy = zodBody === null || zodBody === void 0 ? void 0 : zodBody.userId;
                }
                return [4 /*yield*/, books_model_1.Books.countDocuments(query)];
            case 2:
                totalBooks = _d.sent();
                totalPages = Math.ceil(totalBooks / limit);
                skip = (page - 1) * limit;
                return [4 /*yield*/, books_model_1.Books.find(query)
                        .sort((_a = {}, _a[sortBy] = sort, _a))
                        .skip(skip)
                        .limit(limit)
                        .populate("createdBy", "name email id")];
            case 3:
                books = _d.sent();
                // const books = await Books.find( filter ? { genre: filter } : {} )
                //     .sort( { [ sortBy ]: sort } )
                //     .limit( limit ).populate("createdBy", "name email id");
                if (!books.length) {
                    res.status(404).json({
                        success: false,
                        message: "" + (filter
                            ? "No books found for genre '" + filter + "'"
                            : (zodBody === null || zodBody === void 0 ? void 0 : zodBody.userId) ? "No books found for this user"
                                : "No books found"),
                        data: null
                    });
                    return [2 /*return*/];
                }
                res.status(200).json({
                    success: true,
                    message: "Books retrieved successfully",
                    data: books,
                    meta: {
                        total: totalBooks,
                        page: page,
                        limit: limit,
                        totalPages: totalPages
                    }
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _d.sent();
                // console.error( "Error in getBooks controller:", error.issues );
                if (error_2 instanceof Error) {
                    message = helpers_util_1.isZodError(error_2)
                        ? ((_c = (_b = error_2.issues) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) || "Validation error"
                        : error_2.message;
                    res.status(400).json({
                        message: message,
                        success: false,
                        error: __assign(__assign({ name: error_2.name }, error_2), { stack: error_2.stack })
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
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getBookById = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var bookId, book, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                bookId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, books_model_1.Books.findById(bookId).populate("createdBy", "name email id")];
            case 1:
                book = _b.sent();
                if (!book) {
                    res.status(404).json({
                        success: false,
                        message: "Book not found",
                        data: null
                    });
                    return [2 /*return*/];
                }
                res.status(200).json({
                    success: true,
                    message: "Book retrieved successfully",
                    data: book
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                // console.error( "Error in getBookById controller:", error );
                if (error_3 instanceof Error) {
                    res.status(400).json({
                        message: error_3 === null || error_3 === void 0 ? void 0 : error_3.message,
                        success: false,
                        error: error_3 instanceof Error ? error_3 : "Unknown error",
                        name: error_3.name,
                        stack: error_3.stack
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        success: false,
                        error: error_3,
                        name: "UnknownError",
                        stack: "No stack trace available"
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateBook = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var bookId, zodBooks, book, error_4, message;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                bookId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, zods_util_1.zodUpdateBookSchema.parseAsync(req.body)];
            case 1:
                zodBooks = _d.sent();
                return [4 /*yield*/, books_model_1.Books.findByIdAndUpdate(bookId, zodBooks, { "new": true })];
            case 2:
                book = _d.sent();
                if (!book) {
                    res.status(404).json({
                        success: false,
                        message: "Book not found",
                        data: null
                    });
                    return [2 /*return*/];
                }
                res.status(200).json({
                    success: true,
                    message: "Book updated successfully",
                    data: book
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _d.sent();
                if (error_4 instanceof Error) {
                    message = helpers_util_1.isZodError(error_4)
                        ? ((_c = (_b = error_4.issues) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) || "Validation error"
                        : error_4.message;
                    res.status(400).json({
                        message: message,
                        success: false,
                        error: __assign(__assign({ name: error_4.name }, error_4), { stack: error_4.stack })
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        success: false,
                        error: error_4,
                        name: "UnknownError",
                        stack: "No stack trace available"
                    });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteBook = function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var bookId, book, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                bookId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, books_model_1.Books.findByIdAndDelete(bookId)];
            case 1:
                book = _b.sent();
                if (!book) {
                    res.status(404).json({
                        success: false,
                        message: "Book not found",
                        data: null
                    });
                    return [2 /*return*/];
                }
                res.status(200).json({
                    success: true,
                    message: "Book deleted successfully",
                    data: null
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                // console.error( "Error in deleteBook controller:", error );
                if (error_5 instanceof Error) {
                    res.status(400).json({
                        message: error_5.message,
                        success: false,
                        error: error_5 instanceof Error ? error_5 : "Unknown error",
                        name: error_5.name,
                        stack: error_5.stack
                    });
                }
                else {
                    res.status(500).json({
                        message: "An unknown error occurred",
                        success: false,
                        error: error_5,
                        name: "UnknownError",
                        stack: "No stack trace available"
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
