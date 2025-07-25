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
exports.__esModule = true;
var cookie_parser_1 = require("cookie-parser");
var cors_1 = require("cors");
var express_1 = require("express");
var home_controller_1 = require("./controllers/home.controller");
var auth_route_1 = require("./routes/auth.route");
var books_route_1 = require("./routes/books.route");
var borrow_route_1 = require("./routes/borrow.route");
var app = express_1["default"]();
// [ "http://localhost:3000", "http://localhost:5173", "https://assignment-4-redux-ph-l-2.vercel.app", "https://assignment-4-redux-ph-l-2-ideh.vercel.app" ]
app.use(cookie_parser_1["default"]());
app.use(express_1["default"].json());
app.use(cors_1["default"]({
    origin: "https://assignment-4-redux-ph-l-2-ideh.vercel.app",
    credentials: true
}));
// app.use( express.json( { type: '*/*' } ) );
// app.use( ( req, res, next ) =>
// {
//     const type = req.headers[ 'content-type' ] || '';
//     if ( !type.includes( 'application/json' ) )
//     {
//         req.headers[ 'content-type' ] = 'application/json';
//     }
//     next();
// } );;
app.get("/", home_controller_1.home);
app.use("/api/books", books_route_1.booksRouter);
app.use("/api/borrow", borrow_route_1.borrowRouter);
app.use("/api/auth", auth_route_1.authRouter);
app.use(function (req, res, next) {
    res.status(404).json({ message: "Route not found" });
});
app.use(function (error, req, res, next) {
    if (error) {
        // console.log( "error", typeof error );
        // const errorMessage = JSON.stringify(error);
        res.status(400).json({ message: "Something went wrong from global error handler", status: 500,
            success: false, error: __assign(__assign({ name: error.name || "UnknownError", message: error.message || "An unknown error occurred" }, error), { stack: error.stack || "No stack trace available" })
        });
    }
});
exports["default"] = app;
