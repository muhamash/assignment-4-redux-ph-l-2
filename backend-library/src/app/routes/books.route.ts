import express from 'express';
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/books.controller';
import { verifyAccessToken } from '../middlewares/verifyUser.middleware';

export const booksRouter = express.Router();

booksRouter.post( "/", verifyAccessToken, createBook );

booksRouter.get( "/", getBooks );

booksRouter.get( "/:id", getBookById );

booksRouter.put( "/:id", verifyAccessToken, updateBook );

booksRouter.delete( "/:id", verifyAccessToken, deleteBook );