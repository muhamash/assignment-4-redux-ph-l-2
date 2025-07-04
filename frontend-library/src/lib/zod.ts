import z from "zod/v3";

export const loginSchema = z.object( {
    email: z.string().min( 1, 'Email is required' ).email( 'Invalid email address' ),
    password: z.string().min( 6, 'Password must be at least 6 characters' ),
} );

export const registerSchema = loginSchema.extend( {
    name: z.string().min( 1, "Name is required" ),
} );

export const allowedGenres = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
];

export const zodBookSchema = z.object( {
    title: z.string().min( 1, "Title is required" ),
    author: z.string().min( 1, "Author is required" ),
    genre: z
        .string()
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => allowedGenres.includes( val ), {
            message: `Genre must be one of: ${ allowedGenres.join( ", " ) }`,
        } ),
    isbn: z.string().min( 1, "ISBN is required" ),
    description: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z
          .string()
          .min(8, "Description must be at least 8 characters")
          .max(200, "Description must not exceed 200 characters")
          .optional()
      ),      
    copies: z
        .number( { invalid_type_error: "Copies must be a number" } )
        .int( "Copies must be an integer" )
        .nonnegative( "Copies cannot be negative" ),
    available: z.boolean().optional(),
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
        .refine( ( val ) => allowedGenres.includes( val as unknown ), {
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
