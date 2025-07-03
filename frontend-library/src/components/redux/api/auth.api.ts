import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginFormValues, RegisterFormValues } from "../../types/form.type";

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
            query: ( loginData ) => ( {
                url: "/auth/login",
                method: "POST",
                body: loginData,
            } ),
        } ),
        register: builder.mutation<{ success: boolean; data: any }, RegisterFormValues>( {
            query: ( registerData ) => ( {
                url: "/auth/register",
                method: "POST",
                body: registerData,
            } ),
        } ),
        refreshToken: builder.mutation<{ success: boolean; data: any }, void>( {
            query: () => ( {
                url: "/auth/refresh-token",
                method: "POST",
                credentials: "include",
            } ),
        } ),
    } ),
} );
  
export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation } = authApi;