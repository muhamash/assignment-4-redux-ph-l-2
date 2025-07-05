import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Session } from '../models/session.model';
import { User } from '../models/user.model';
import { isZodError } from '../utils/helpers.util';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { zodLoginSchema, zodRefreshTokenSchema, zodUserSchema } from '../utils/zods.util';

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
            res.status( 404 ).json( {
                success: false,
                message: "User not found",
            } );

            return;
        }

        const verifyUser = await bcrypt.compare( zodLogin.password, user.password )
        if ( !verifyUser ) 
        {
            res.status( 401 ).json( {
                success: false,
                message: "Invalid credentials",
            } );

            return
        }

        const accessToken = generateAccessToken( user.id );
        const refreshToken = generateRefreshToken( user.id );
        const expiresAt = new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 );
        const accessTokenExpiresAt = new Date(Date.now() + 1 * 60 * 1000);

        await Session.deleteMany({ user: user.id });

        await Session.create( {
            user: user.id,
            refreshToken,
            expiresAt
        } );
       
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).status( 200 ).json( {
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                accessToken,
                accessTokenExpiresAt,
                expire: "1 minute only"
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
        console.log("Refresh token request received");
        console.log("Cookies:", req.cookies);
        
        if ( !req.cookies || !req.cookies.refreshToken )
        {
            console.log("No refresh token found in cookies");
            res.status( 401 ).json( { 
                success: false,
                message: "No refresh token found in cookies" 
            } );
            
            return
        }
  
        const { refreshToken } = await zodRefreshTokenSchema.parseAsync( {
            refreshToken: req.cookies.refreshToken,
        } );
  
        console.log("Looking for session with refresh token:", refreshToken);
        
        const session = await Session.findOne( { refreshToken } );
        console.log("Found session:", session);
        
        if ( !session )
        {
            console.log("No session found for refresh token");
            res.status( 403 ).json( { 
                success: false,
                message: "Invalid session", 
                status: 403 
            } );

            return
        }

        // Check if session has expired
        if (session.expiresAt && new Date() > session.expiresAt) {
            console.log("Session has expired");
            await Session.findOneAndDelete({ refreshToken });
            res.status( 403 ).json( { 
                success: false,
                message: "Session expired", 
                status: 403 
            } );
            return;
        }
  
        let payload;
        try {
            payload = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET! ) as any;
            console.log("JWT payload:", payload);
        } catch (jwtError) {
            console.log("JWT verification failed:", jwtError);
            await Session.findOneAndDelete({ refreshToken });
            res.status( 403 ).json( { 
                success: false,
                message: "Invalid refresh token", 
                status: 403 
            } );
            return;
        }
        
        const user = await User.findById(payload.id).select("-password");
        
        if (!user) {
            console.log("User not found for ID:", payload.id);
            await Session.findOneAndDelete({ refreshToken });
            res.status( 403 ).json( { 
                success: false,
                message: "User not found", 
                status: 403 
            } );
            return;
        }
  
        const newAccessToken = generateAccessToken( payload.id );
        const newRefreshToken = generateRefreshToken( payload.id );
        const expiresAt = new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 );
        const accessTokenExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
  
        // Update the session with new refresh token
        await Session.findOneAndUpdate(
            { refreshToken },
            { refreshToken: newRefreshToken, expiresAt }
        );          
  
        res.cookie( "refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        } ).status( 200 ).json( {
            success: true,
            message: "Access token successfully retrieved",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                accessToken: newAccessToken,
                accessTokenExpiresAt,
                expire: "1 minute only",
            },
        } );
  
    }
    catch ( error )
    {
        console.log("Refresh token error:", error);
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
        }
        else
        {
            res.status( 500 ).json( {
                message: "An unknown error occurred",
                success: false,
                error,
            } );
        }
    }
};
  
export const logoutUser = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const { refreshToken } = await zodRefreshTokenSchema.parseAsync( {
            refreshToken: req.cookies.refreshToken,
        } );

        const session = await Session.findOne( { refreshToken } );
        if ( !session )
        {
            res.status( 403 ).json( { message: "Invalid session", status: 403 } );
            return
        }
      
        await Session.findOneAndDelete( { refreshToken } );
      
        res.clearCookie( "refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        } );
      
        res.status( 200 ).json( {
            success: true,
            message: "Logged out successfully"
        } );
    } catch ( error )
    {
        console.error( "Logout error:", error );
        res.status( 500 ).json( {
            success: false,
            message: "An error occurred during logout",
        } );
    }
};