import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BookQueryParams, IBook, IBorrowSummaryItem, ICreateBookInput, IPaginationMeta, IUpdateBookInput } from "../../types/books.type";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const booksApi = createApi( {
    reducerPath: "booksApi",
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        credentials: "include",
        prepareHeaders: ( headers, { getState } ) =>
        {
            const token = ( getState() as never ).auth.accessToken;
            // console.log(token)
            if ( token )
            {
                headers.set( "authorization", `Bearer ${ token }` );
            }
            return headers;
        },
    } ),
    tagTypes: [ "books", "borrows" ],
    endpoints: ( builder ) => ( {
        getBooks: builder.query<{ success: true; data: IBook[]; meta: IPaginationMeta }, BookQueryParams>( {
            query: ( params = {} ) =>
            {
                const urlParams = new URLSearchParams();

                if ( params.filter ) urlParams.append( "filter", params.filter );
                if ( params.sortBy ) urlParams.append( "sortBy", params.sortBy );
                if ( params.sort ) urlParams.append( "sort", params.sort );
                if ( params.limit ) urlParams.append( "limit", params.limit );
                if ( params.page ) urlParams.append( "page", params.page );
                if ( params.userId ) urlParams.append( "userId", params.userId );
                
                console.log( { params }, `/books?${ urlParams.toString() }` );
        
                return `/books?${ urlParams.toString() }`;
            },
            providesTags: [ "books" ],
        } ),

        getBook: builder.query<{ success: true; data: IBook }, string>( {
            query: ( bookId ) => `/books/${ bookId }`,
            providesTags: [ "books" ],
        } ),

        createBook: builder.mutation<{ success: true; data: IBook }, ICreateBookInput>( {
            query: ( body ) => ( {
                url: "/books",
                method: "POST",
                body,
            } ),
            invalidatesTags: [ "books" ],
        } ),

        updateBook: builder.mutation<{ success: true; data: IBook }, { id: string; body: IUpdateBookInput }>( {
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
            invalidatesTags: [ "books", "borrows" ],
        } ),

        borrowBook: builder.mutation<{ success: true; message: string }, { book: string; quantity: number, user: string, dueDate: Date }>( {
            query: ( body ) => ( {
                url: "/borrow",
                method: "POST",
                body,
            } ),
            invalidatesTags: [ "books", "borrows" ],
        } ),
      
        getBorrowSummary: builder.query<{ success: true; data: IBorrowSummaryItem[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }, { page?: number; limit?: number }>( {
            query: ( { page = 1, limit = 10 } = {} ) =>
            {
                const params = new URLSearchParams();
                params.append( "page", String( page ) );
                params.append( "limit", String( limit ) );
        
                return `/borrow/summary?${ params.toString() }`;
            },
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