import { Model, Schema, Types } from "mongoose";

export enum Genre {
    FICTION = 'FICTION',
    NON_FICTION = 'NON_FICTION',
    SCIENCE = 'SCIENCE',
    HISTORY = 'HISTORY',
    BIOGRAPHY = 'BIOGRAPHY',
    FANTASY = 'FANTASY',
  }

export interface IBooks
{
    title: string;
    author: string;
    genre: Genre,
    isbn: string;
    description?: string;
    copies: number;
    available: boolean;
    createdBy: Schema.Types.ObjectId;
}

export interface IBookStaticMethod extends Model<IBooks> {
  adjustCopiesAfterBorrow(bookId: string, quantity: number): Promise<boolean>;
}