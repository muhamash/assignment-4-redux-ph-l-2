import { Schema, Types } from "mongoose";

export interface IBorrow
{
    book: Types.ObjectId;
    quantity: number;
    dueDate: Date;
    user: Types.ObjectId;
}