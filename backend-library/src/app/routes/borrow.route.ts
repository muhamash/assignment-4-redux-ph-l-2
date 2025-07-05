import express from 'express';
import { borrowABook, BorrowBooksSummary } from '../controllers/borrow.controller';
import { preventOwnBorrow } from '../middlewares/preventOwnBorrow.middleware';
import { verifyAccessToken } from '../middlewares/verifyUser.middleware';

export const borrowRouter = express.Router();

borrowRouter.post( "/", verifyAccessToken, preventOwnBorrow, borrowABook );

borrowRouter.get( "/summary", verifyAccessToken, BorrowBooksSummary );