import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const booksApi = createApi( {
    reducerPath: "booksApi",
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        credentials: "include",
    } ),
    tagTypes: [ "books" ],
    endpoints: ( builder ) => ( {
        getBooks: builder.query<{ success: true; data: any }, void>( {
            query: () => "/books",
            providesTags: [ "books" ],
        } ),

        getBook: builder.query<{ success: true; data: any }, string>( {
            query: ( bookId ) => `/books/${ bookId }`,
        } ),

        createBook: builder.mutation<{ success: true; data: any }, any>( {
            query: ( body ) => ( {
                url: "/books",
                method: "POST",
                body,
            } ),
            invalidatesTags: [ "books" ],
        } ),

        updateBook: builder.mutation<{ success: true; data: any }, { id: string; body: any }>( {
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
    } ),
} );

export const {
    useGetBooksQuery,
    useGetBookQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} = booksApi;