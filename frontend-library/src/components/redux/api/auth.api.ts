import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginResponse, RefreshTokenResponse } from "../../types/auth.type";
import type { LoginValues, RegisterValues } from "../../types/form.type";
import type { RootState } from "../store/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log( BASE_URL );

export const authApi = createApi( {
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        credentials: "include",
        prepareHeaders: ( headers, { getState } ) =>
        {
            const token = ( getState() as RootState ).auth.accessToken;
            console.log(token)
            if ( token )
            {
                headers.set( "authorization", `Bearer ${ token }` );
            }
            return headers;
        },
    } ),
    endpoints: ( builder ) => ( {
        login: builder.mutation<LoginResponse, LoginValues>( {
            query: ( loginData ) => ( {
                url: "/auth/login",
                method: "POST",
                body: loginData,
            } ),
        } ),
        register: builder.mutation<{ success: boolean; data: unknown }, RegisterValues>( {
            query: ( registerData ) => ( {
                url: "/auth/register",
                method: "POST",
                body: registerData,
            } ),
        } ),
        refreshToken: builder.mutation<{ success: boolean; data: RefreshTokenResponse }, void>( {
            query: () => ( {
                url: "/auth/refresh-token",
                method: "POST",
                credentials: "include",
            } ),
        } ),
    } ),
} );
  
export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation } = authApi;