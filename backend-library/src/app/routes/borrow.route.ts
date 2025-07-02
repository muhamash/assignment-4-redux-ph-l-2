import express from 'express';
import { borrowABook, BorrowBooksSummary } from '../controllers/borrow.controller';
import { verifyAccessToken } from '../middleware/verifyUser.middleware';
import { preventOwnBorrow } from '../middleware/preventOwnBorrow.middleware';

export const borrowRouter = express.Router();

borrowRouter.post( "/", verifyAccessToken, preventOwnBorrow, borrowABook );

borrowRouter.get( "/", verifyAccessToken, BorrowBooksSummary );