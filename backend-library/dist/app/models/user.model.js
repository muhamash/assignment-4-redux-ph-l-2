"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: [true, "User already exist"],
        max: [20, "Name should not be longer than 20 characters"],
        min: [1, "Name should not be shorter than 1 character"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exist"],
        max: [50, "Email should not be longer than 50 characters"],
        min: [5, "Email should not be shorter than 5 characters"],
        match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [6, "Password should be at least 6 characters"],
        max: [128, "Password should not be longer than 128 characters"],
    }
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.methods.comparePassword = async function (plainPassword) {
    return bcryptjs_1.default.compare(plainPassword, this.password);
};
userSchema.virtual("activeSessions", {
    ref: "Session",
    localField: "_id",
    foreignField: "user",
});
userSchema.pre("validate", function (next) {
    this.email = this.email.toLowerCase();
    next();
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
userSchema.pre("findOneAndDelete", async function (next) {
    const docToDelete = await this.model.findOne(this.getFilter());
    if (docToDelete) {
        const Session = require("./session.model");
        await Session.deleteMany({ user: docToDelete._id });
    }
    next();
});
exports.User = (0, mongoose_1.model)("User", userSchema);
