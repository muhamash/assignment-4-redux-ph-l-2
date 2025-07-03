import { Request, Response, NextFunction } from "express";
import { Books } from "../models/books.model";
import { AuthenticatedRequest } from "../interfaces/authRequest.interface";

export const preventOwnBorrow = async ( req: AuthenticatedRequest, res: Response, next: NextFunction ) =>
{
    try
    {
        const bookId = req.body.book;
        const userId = req.user.id;

        
        const book = await Books.findById( bookId );

        if ( !book )
        {
            return res.status( 404 ).json( { message: "Book not found", success: false, data: null } );
        }

        // console.log( book );
        if ( book.createdBy.toString() === userId )
        {
            return res.status( 400 ).json( {
                message: "You cannot borrow your own book",
                success: false
            } );
        }

        next();
    }
    catch ( error )
    {
        next( error );
    }
};