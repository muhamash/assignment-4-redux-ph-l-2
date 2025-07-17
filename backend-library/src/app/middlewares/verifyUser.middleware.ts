import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../interfaces/authRequest.interface";


export const verifyAccessToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) =>
{
    try
    {
        const authHeader = req.headers.authorization as string;

        if ( !authHeader || !authHeader.startsWith( "Bearer " ) )
        {
            res.status( 401 ).json( {
                message: "No token provided",
                success: false,
            } );

            return
        }

        const token = authHeader.split( " " )[ 1 ];
        const payload = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET! ) as { id: string };

        req.user = { id: payload.id };

        next();
    } catch ( error )
    {
        res.status( 401 ).json( {
            message: "Invalid or expired token",
            success: false,
        } );

        return
    }
};