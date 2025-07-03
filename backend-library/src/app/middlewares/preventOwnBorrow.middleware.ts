import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authRequest.interface";
import { Books } from "../models/books.model";

export const preventOwnBorrow = async ( req: AuthenticatedRequest, res: Response, next: NextFunction ) =>
{
    try
    {
        const bookId = req.body.book;
        const userId = req.user?.id;

        
        const book = await Books.findById( bookId );

        if ( !book )
        {
            res.status( 404 ).json( { message: "Book not found", success: false, data: null } );

            return
        }

        // console.log( book );
        if ( book?.createdBy?.toString() === userId )
        {
            res.status( 400 ).json( {
                message: "You cannot borrow your own book",
                success: false
            } );

            return
        }

        next();
    }
    catch ( error )
    {
        next( error );
    }
};