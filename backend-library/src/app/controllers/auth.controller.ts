import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';
import { isZodError } from '../utils/helpers.util';
import { zodLoginSchema, zodRefreshTokenSchema, zodUserSchema } from '../utils/zods.util';
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { Session } from '../models/session.model';
import jwt from 'jsonwebtoken';

export const createUser = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const zodUser = await zodUserSchema.parseAsync( req.body );
        console.log( zodUser )
        
        const user = await User.create( zodUser );
        res.status( 201 ).json( {
            success: true,
            message: "user created successfully",
            data: user,
            status: 201,
        } );
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

export const login = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const zodLogin = await zodLoginSchema.parseAsync( req.body );

        const user = await User.findOne( { email: zodLogin.email } );
        if ( !user )
        {
            return res.status( 404 ).json( {
                success: false,
                message: "User not found",
            } );
        }

        const verifyUser = await bcrypt.compare( zodLogin.password, user.password )
        if ( !verifyUser ) 
        {
            return res.status( 401 ).json( {
                success: false,
                message: "Invalid credentials",
            } );
        }

        const accessToken = generateAccessToken( user.id );
        const refreshToken = generateRefreshToken( user.id );
        const expiresAt = new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 );

        await Session.create( {
            user: user.id,
            refreshToken,
            expiresAt
        } );
       

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          }).status( 200 ).json( {
            success: true,
            message: "Login successful",
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                accessToken,
                expiresAt,
                expire: "15 mints only"
            },
        } );
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

export const refreshToken = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        if ( !req.cookies || !req.cookies.refreshToken )
        {
            return res.status( 401 ).json( { message: "No refresh token found in cookies" } );
        }
  
        const { refreshToken } = await zodRefreshTokenSchema.parseAsync( {
            refreshToken: req.cookies.refreshToken,
        } );
  
        const session = await Session.findOne( { refreshToken } );
        if ( !session ) return res.status( 403 ).json( { message: "Invalid session", status: 403 } );
  
        const payload = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET! ) as any;
  
        const newAccessToken = generateAccessToken( payload.id );
        const newRefreshToken = generateRefreshToken( payload.id );
        const expiresAt = new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 );
  
        await Session.create( {
            user: payload.id,
            refreshToken: newRefreshToken,
            expiresAt,
        } );
  
        res.cookie( "refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        } ).status( 200 ).json( {
            success: true,
            message: "Access token successfully retrieved",
            data: {
                accessToken: newAccessToken,
                expiresAt,
                expire: "15 minutes only",
            },
        } );
  
    }
    catch ( error )
    {
        if ( error instanceof Error )
        {
            const message = error.name === "ZodError"
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
        } else
        {
            res.status( 500 ).json( {
                message: "An unknown error occurred",
                success: false,
                error,
            } );
        }
    }
};
  
export const logoutUser = async ( req, res ): Promise<void> =>
{
    const { refreshToken } = await zodRefreshTokenSchema.parseAsync( {
        refreshToken: req.cookies.refreshToken,
    } );

    const session = await Session.findOne( { refreshToken } );
    if ( !session ) return res.status( 403 ).json( { message: "Invalid session", status: 403 } );
  
    // await Session.findOneAndDelete( { refreshToken } );
  
    res.clearCookie( "refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    } );
  
    res.status( 204 ).send();
};  