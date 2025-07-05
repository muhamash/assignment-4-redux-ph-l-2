import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { AuthState, User } from "../../../types/auth.type";

const initialState: AuthState = {
    user: null,
    accessToken: null,
    accessTokenExpiresAt: undefined
};

const authSlice = createSlice( {
    name: "auth",
    initialState,
    reducers: {
        getCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken: string, accessTokenExpiresAt?: string | Date | null }>
        ) =>
        {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;

            // Cookies.set( "accessToken", action.payload.accessToken, { expires: 7 } );
        },
        logout: ( state ) =>
        {
            state.user = null;
            state.accessToken = null;
            Cookies.remove( "accessToken" );
        },
    },
} );

export const { getCredentials, logout } = authSlice.actions;
export default authSlice.reducer;