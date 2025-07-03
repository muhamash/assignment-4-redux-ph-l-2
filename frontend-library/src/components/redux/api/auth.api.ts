import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginFormValues, RegisterFormValues } from "../../types/FormTypes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log( BASE_URL );

export const authApi = createApi( {
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL, 
        credentials: "include", 
    } ),
    endpoints: ( builder ) => ( {
        login: builder.mutation<{ success: boolean; data: any }, LoginFormValues>( {
            query: ( credentials ) => ( {
                url: "/auth/login",
                method: "POST",
                body: credentials,
            } ),
        } ),
        register: builder.mutation<{ success: boolean; data: any }, RegisterFormValues>( {
            query: ( credentials ) => ( {
                url: "/auth/register",
                method: "POST",
                body: credentials,
            } ),
        } ),
    } ),
} );
  
export const { useLoginMutation, useRegisterMutation } = authApi;