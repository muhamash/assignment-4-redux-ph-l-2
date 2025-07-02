import { NextFunction, Request, Response } from 'express';
import { isZodError } from '../utils/helpers.util';

export const createUser = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        
    }
    catch ( error )
    {
        if ( error instanceof Error )
        {
            const message = isZodError(error) ? (error as any).issue?.[0]?.message ||  "Validation error"
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
}