import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IBook } from "../../types/books.type";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const booksApi = createApi( {
    reducerPath: "booksApi",
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        credentials: "include",
    } ),
    tagTypes: [ "books" , "borrows"],
    endpoints: ( builder ) => ( {
        getBooks: builder.query<{ success: true; data: IBook[] }, void>( {
            query: () => "/books",
            providesTags: [ "books" ],
        } ),

        getBook: builder.query<{ success: true; data: IBook }, string>( {
            query: ( bookId ) => `/books/${ bookId }`,
        } ),

        createBook: builder.mutation<{ success: true; data: IBook }, any>( {
            query: ( body ) => ( {
                url: "/books",
                method: "POST",
                body,
            } ),
            invalidatesTags: [ "books" ],
        } ),

        updateBook: builder.mutation<{ success: true; data: IBook }, { id: string; body: any }>( {
            query: ( { id, body } ) => ( {
                url: `/books/${ id }`,
                method: "PUT",
                body,
            } ),
            invalidatesTags: [ "books" ],
        } ),

        deleteBook: builder.mutation<{ success: true; message: string }, string>( {
            query: ( id ) => ( {
                url: `/books/${ id }`,
                method: "DELETE",
            } ),
            invalidatesTags: [ "books" ],
        } ),

        borrowBook: builder.mutation<{ success: true; message: string }, { book: string; quantity: number, user: string, dueDate: string }>( {
            query: ( body ) => ( {
                url: "/borrow",
                method: "POST",
                body,
            } ),
            invalidatesTags: [ "books", "borrows" ],
        } ),
      
        getBorrowSummary: builder.query<{ success: true; data: any[] }, void>( {
            query: () => "/borrow/summary",
            providesTags: [ "borrows" ],
        } ),
    } ),
} );

export const {
    useGetBooksQuery,
    useGetBookQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useBorrowBookMutation,
    useGetBorrowSummaryQuery,
} = booksApi;