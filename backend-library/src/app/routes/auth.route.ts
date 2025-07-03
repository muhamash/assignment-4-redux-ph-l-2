import express from "express";
import { createUser, login, logoutUser, refreshToken } from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post( "/register", createUser );

authRouter.post( "/login", login );

authRouter.post( "/refresh-token", refreshToken );

authRouter.post( "/logout", logoutUser );