"use strict";
exports.__esModule = true;
exports.zodRefreshTokenSchema = exports.zodLoginSchema = exports.zodUserSchema = exports.zodFilterSchema = exports.zodUpdateBookSchema = exports.zodBorrowSchema = exports.zodBookSchema = void 0;
var zod_1 = require("zod");
var allowedGenres = [
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
];
var allowedFiltersProperties = [
    "title",
    "author",
    "genre",
    "isbn",
    "description",
    "copies",
    "available",
    "createdAt",
    "updatedAt",
];
exports.zodBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required and minimum 1 char"),
    author: zod_1.z.string().min(1, "Author is required and minimum 1 char"),
    genre: zod_1.z
        .string()
        .transform(function (val) { return val.toUpperCase(); })
        .refine(function (val) { return allowedGenres.includes(val); }, {
        message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY"
    }),
    isbn: zod_1.z.string().min(1, "ISBN is required and minimum 1 char"),
    description: zod_1.z
        .string()
        .min(8, "Description must be at least 8 characters long")
        .max(100, "Description must not exceed 100 characters")
        .optional(),
    copies: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "Copies must be a non-negative number" })
        .refine(function (value) { return value >= 0; }, {
        message: "Copies must be a non-negative number"
    }),
    available: zod_1.z.boolean().optional(),
    createdBy: zod_1.z.string()
});
exports.zodBorrowSchema = zod_1.z.object({
    book: zod_1.z.string(),
    user: zod_1.z.string(),
    quantity: zod_1.z
        .number()
        .int()
        .min(1, "Quantity must be at least 1")
        .refine(function (value) { return value >= 1; }, {
        message: "Quantity must be at least 1"
    }),
    dueDate: zod_1.z
        .string()
        .transform(function (val) { return new Date(val); })
        .refine(function (date) { return date.getTime() > Date.now(); }, {
        message: "Due date must be in the future"
    })
});
exports.zodUpdateBookSchema = exports.zodBookSchema.partial().extend({
    title: zod_1.z.string().min(1, "and minimum 1 char for title").optional(),
    isbn: zod_1.z.string().min(1, "and minimum 1 char for author").optional(),
    description: zod_1.z
        .string()
        .min(8, "Description must be at least 8 characters long")
        .max(100, "Description must not exceed 100 characters")
        .optional(),
    copies: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "Copies must be a non-negative number" })
        .refine(function (value) { return value >= 0; }, {
        message: "Copies must be a non-negative number"
    }).optional(),
    genre: zod_1.z
        .string()
        .transform(function (val) { return val.toUpperCase(); })
        .refine(function (val) { return allowedGenres.includes(val); }, {
        message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY"
    }).optional(),
    author: zod_1.z.string().min(1, "Author is required and minimum 1 char").optional(),
    available: zod_1.z.boolean().optional()
}).refine(function (data) {
    return Object.keys(data).some(function (key) {
        return key !== "book" && data[key] !== undefined;
    });
}, {
    message: "At least one field must be provided for update"
});
exports.zodFilterSchema = zod_1.z.object({
    filter: zod_1.z.string()
        .transform(function (val) { return val.toUpperCase(); })
        .refine(function (val) { return allowedGenres.includes(val); }, {
        message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY"
    }).optional(),
    sortBy: zod_1.z["enum"](allowedFiltersProperties).optional(),
    sort: zod_1.z["enum"](["asc", "desc"]).optional(),
    limit: zod_1.z.string().transform(Number)["default"]("10").optional(),
    userId: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(Number)["default"]("1").optional()
});
exports.zodUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required and must be at least 1 character").max(20, "Name should not exceed 20 characters"),
    email: zod_1.z.string().email("Invalid email format").max(50, "Email should not exceed 50 characters"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").max(128, "Password should not exceed 128 characters")
});
exports.zodLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").max(50, "Email should not exceed 50 characters"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters")
});
exports.zodRefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10, "Refresh token required")
});
