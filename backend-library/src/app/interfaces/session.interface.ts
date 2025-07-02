import { Types } from "mongoose";

export interface ISession {
    user: Types.ObjectId;
    refreshToken: string;
    createdAt: Date;
    expiresAt: Date;
};