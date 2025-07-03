import z from "zod/v3";

export const loginSchema = z.object( {
    email: z.string().min( 1, 'Email is required' ).email( 'Invalid email address' ),
    password: z.string().min( 6, 'Password must be at least 6 characters' ),
} );

export const registerSchema = loginSchema.extend( {
    name: z.string().min( 1, "Name is required" ),
} );