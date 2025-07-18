import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/authRequest.interface';
import { Books } from '../models/books.model';
import { isZodError } from '../utils/helpers.util';
import { zodBookSchema, zodFilterSchema, zodUpdateBookSchema } from "../utils/zods.util";

export const createBook = async ( req: AuthenticatedRequest, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const zodBooks = await zodBookSchema.parseAsync( {
            ...req.body,
            createdBy: req.user?.id,
        } );
        // console.log( "Validated Book Data:", zodBooks );
        
        const book = await Books.create( zodBooks );

        // console.log( "Book created successfully:", req.body, book );

        res.status( 201 ).json( {
            success: true,
            message: "Book created successfully",
            data: book,
            status: 201,
        } );
    }
    catch ( error )
    {

        if ( error instanceof Error )
        {
            const message = isZodError(error)
                ? ( error as any ).issues?.[ 0 ]?.message || "Validation error"
                : error.message;
      
            res.status( 500 ).json( {
                message,
                success: false,
                error: {
                    name: error.name,
                    ...( error as any ),
                    stack: error.stack,
                },
            } );
        }
        else
        {
            res.status( 500 ).json( {
                message: "An unknown error occurred",
                status: 500,
                success: false,
                error,
                name: "UnknownError",
                stack: "No stack trace available",
            } );
        }
    }
};

export const getBooks = async ( req: Request, res: Response ): Promise<void> =>
{
    try
    {
        // console.log( "getBooks controller called with query:", req.query );
        const zodBody = await zodFilterSchema.parseAsync( req.query );
        console.log( "Validated Query Parameters:", zodBody );
        
        const filter = zodBody.filter as string | undefined;
        const sortBy = zodBody.sortBy as string || 'createdAt';
        const sort = zodBody.sort === 'desc' ? -1 : 1;
        const limit: number = parseInt( zodBody.limit as any ) || 10;
        const page: number = parseInt( zodBody.page as any ) || 1;

        // console.log(filter?.toUpperCase())
        const query: any = {};
        if (filter) {
            query.genre = filter;
        }
        if (zodBody?.userId) {
            query.createdBy = zodBody?.userId;
        }

        const totalBooks = await Books.countDocuments( query );
        const totalPages = Math.ceil( totalBooks / limit );
        const skip = (page - 1) * limit;
        
        const books = await Books.find( query )
            .sort( { [ sortBy ]: sort } )
            .skip(skip)
            .limit( limit )
            .populate( "createdBy", "name email id" );

        // const books = await Books.find( filter ? { genre: filter } : {} )
        //     .sort( { [ sortBy ]: sort } )
        //     .limit( limit ).populate("createdBy", "name email id");


        if (!books.length) {
            res.status( 404 ).json( {
                success: false,
                message: `${ filter
                        ? `No books found for genre '${ filter }'`
                        : zodBody?.userId
                            ? `No books found for this user`
                            : "No books found"
                    }`,
                data: null,
            } );
            
            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Books retrieved successfully",
            data: books,
            meta: {
                total: totalBooks,
                page: page,
                limit: limit,
                totalPages,
            },
        } );
    } catch ( error )
    {
        // console.error( "Error in getBooks controller:", error.issues );
        if ( error instanceof Error )
        {
            const message = isZodError(error)
                ? ( error as any ).issues?.[ 0 ]?.message || "Validation error"
                : error.message;
            
            res.status( 400 ).json( {
                message,
                success: false,
                error: {
                    name: error.name,
                    ...( error as any ),
                    stack: error.stack,
                },
            } );
        }
        else
        {
            res.status( 500 ).json( {
                message: "An unknown error occurred",
                success: false,
                error: error,
                name: "UnknownError",
                stack: "No stack trace available"
            } );
        }
    }
};

export const getBookById = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("getBookById controller called with ID:", bookId);
        
        const book = await Books.findById( bookId ).populate("createdBy", "name email id");
        if ( !book )
        {
            res.status( 404 ).json( {
                success: false,
                message: "Book not found",
                data: null
            } );

            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Book retrieved successfully",
            data: book
        } );
    }
    catch ( error )
    {
        // console.error( "Error in getBookById controller:", error );
        
        if( error instanceof Error )
        {
            res.status( 400 ).json( {
                message: error?.message,
                success: false,
                error: error instanceof Error ? error as any : "Unknown error", name: error.name,
                stack: error.stack
            });
    
        }
        else
        {
            res.status( 500 ).json( {
                message: "An unknown error occurred",
                success: false,
                error: error,
                name: "UnknownError",
                stack: "No stack trace available"
            } );
        }
        // next(error);
    }
};

export const updateBook = async ( req: AuthenticatedRequest<{id: string}>, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("updateBook controller called with ID:", bookId);
        
        const zodBooks = await zodUpdateBookSchema.parseAsync( req.body );
        // console.log( "Validated Book Data for Update:", zodBooks );
        
        const book = await Books.findByIdAndUpdate( bookId, zodBooks, { new: true } );
        if ( !book )
        {
            res.status( 404 ).json( {
                success: false,
                message: "Book not found",
                data: null
            } );

            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Book updated successfully",
            data: book
        } );
    }
    catch ( error )
    {
      
        if ( error instanceof Error )
        {
            const message = isZodError(error)
                ? ( error as any ).issues?.[ 0 ]?.message || "Validation error"
                : error.message;
      
            res.status( 400 ).json( {
                message,
                success: false,
                error: {
                    name: error.name,
                    ...( error as any ),
                    stack: error.stack,
                },
            } );
        }
        else
        {
            res.status( 500 ).json( {
                message: "An unknown error occurred",
                success: false,
                error,
                name: "UnknownError",
                stack: "No stack trace available",
            } );
        }
    }
}   

export const deleteBook = async ( req: AuthenticatedRequest<{id: string}>, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // const bookId = (req.params as { id: string }).id;
        // console.log("deleteBook controller called with ID:", bookId);
        
        const book = await Books.findByIdAndDelete( bookId );
        if ( !book )
        {
            res.status( 404 ).json( {
                success: false,
                message: "Book not found",
                data: null
            } );

            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Book deleted successfully",
            data: null
        } );
    }
    catch ( error )
    {
        // console.error( "Error in deleteBook controller:", error );
        
        if ( error instanceof Error )
        {
            res.status( 400 ).json( {
                message: error.message,
                success: false,
                error: error instanceof Error ? error as any : "Unknown error",
                name: error.name,
                stack: error.stack
            } );
        }
        else
        {
            res.status( 500 ).json( {
                message: "An unknown error occurred",
                success: false,
                error: error,
                name: "UnknownError",
                stack: "No stack trace available"
            } );
        }

        // next(error);
    }
};