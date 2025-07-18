import { z } from "zod";

const allowedGenres = [
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
] as const;

const allowedFiltersProperties = [
    "title",
    "author",
    "genre",
    "isbn",
    "description",
    "copies",
    "available",
    "createdAt",
    "updatedAt",
] as const;

export const zodBookSchema = z.object( {
    title: z.string().min( 1, "Title is required and minimum 1 char" ),
    author: z.string().min( 1, "Author is required and minimum 1 char" ),
    genre: z
        .string()
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => allowedGenres.includes( val as any ), {
            message:
                "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        } ),
    isbn: z.string().min( 1, "ISBN is required and minimum 1 char" ),
    description: z
        .string()
        .min( 8, "Description must be at least 8 characters long" )
        .max( 100, "Description must not exceed 100 characters" )
        .optional(),
    copies: z
        .number()
        .int()
        .nonnegative( { message: "Copies must be a non-negative number" } )
        .refine( ( value ) => value >= 0, {
            message: "Copies must be a non-negative number",
        } ),
    available: z.boolean().optional(),
    createdBy: z.string()
} );

export const zodBorrowSchema = z.object( {
    book: z.string(),
    user: z.string(),
    quantity: z
        .number()
        .int()
        .min( 1, "Quantity must be at least 1" )
        .refine( ( value ) => value >= 1, {
            message: "Quantity must be at least 1",
        } ),
    dueDate: z
        .string()
        .transform( ( val ) => new Date( val ) )
        .refine( ( date ) => date.getTime() > Date.now(), {
            message: "Due date must be in the future",
        } ),
} );

export const zodUpdateBookSchema = zodBookSchema.partial().extend( {
    title: z.string().min( 1, "and minimum 1 char for title" ).optional(),
    isbn: z.string().min( 1, "and minimum 1 char for author" ).optional(),
    description: z
        .string()
        .min( 8, "Description must be at least 8 characters long" )
        .max( 100, "Description must not exceed 100 characters" )
        .optional(),
    copies: z
        .number()
        .int()
        .nonnegative( { message: "Copies must be a non-negative number" } )
        .refine( ( value ) => value >= 0, {
            message: "Copies must be a non-negative number",
        } ).optional(),
    genre: z
        .string()
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => allowedGenres.includes( val as any ), {
            message:
                "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        } ).optional(),
    author: z.string().min( 1, "Author is required and minimum 1 char" ).optional(),
    available: z.boolean().optional(),
} ).refine( ( data ) =>
{
    return Object.keys( data ).some( ( key ) =>
    {
        return key !== "book" && data[ key as keyof typeof data ] !== undefined;
    } );
}, {
    message: "At least one field must be provided for update",
} );

export const zodFilterSchema = z.object( {
    filter: z.string()
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => allowedGenres.includes( val as any ), {
            message:
                "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        } ).optional(),
    sortBy: z.enum( allowedFiltersProperties ).optional(),
    sort: z.enum( [ "asc", "desc" ] ).optional(),
    limit: z.string().transform( Number ).default( "10" ).optional(),
    userId: z.string().optional(),
    page:z.string().transform( Number ).default( "1" ).optional()
} );

export const zodUserSchema = z.object( {
    name: z.string().min( 1, "Name is required and must be at least 1 character" ).max( 20, "Name should not exceed 20 characters" ),
    email: z.string().email( "Invalid email format" ).max( 50, "Email should not exceed 50 characters" ),
    password: z.string().min( 6, "Password must be at least 6 characters" ).max( 128, "Password should not exceed 128 characters" ),
} );

export const zodLoginSchema = z.object( {
    email: z.string().email( "Invalid email format" ).max( 50, "Email should not exceed 50 characters" ),
    password: z.string().min( 6, "Password must be at least 6 characters" ),
} );

export const zodRefreshTokenSchema = z.object( {
    refreshToken: z.string().min( 10, "Refresh token required" ),
} );  