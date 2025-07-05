import { useCallback, useEffect, useRef } from "react";
import { authApi } from "../redux/api/auth.api";
import { getCredentials, logout } from "../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";

export const useAutoRefresh = () =>
{
    const { accessTokenExpiresAt, user } = useAppSelector( ( state ) => state.auth );
    const dispatch = useAppDispatch();
    const timerRef = useRef<NodeJS.Timeout | null>( null );

    const handleRefresh = useCallback( async () =>
    {
        try
        {
            console.log( "Attempting to refresh token..." );
            
            const refreshResult = await dispatch(
                authApi.endpoints.refreshToken.initiate()
            ).unwrap();

            console.log( "Refresh token result:", refreshResult );

            if ( refreshResult?.success && refreshResult?.data )
            {
                dispatch(
                    getCredentials( {
                        user: refreshResult.data.user,
                        accessToken: refreshResult.data.accessToken,
                        accessTokenExpiresAt: refreshResult.data.accessTokenExpiresAt,
                    } )
                );
                console.log( "Token refreshed successfully" );
            } else
            {
                console.log( "Refresh failed, logging out" );
                dispatch( logout() );
            }
        } catch ( error )
        {
            console.error( "Token refresh failed:", error );
            dispatch( logout() );
        }
    }, [ dispatch ] );

    useEffect( () =>
    {
        if ( timerRef.current )
        {
            clearTimeout( timerRef.current );
            timerRef.current = null;
        }

        if ( !accessTokenExpiresAt || !user )
        {
            console.log( "No token expiry or user, skipping refresh setup" );
            return;
        }

        console.log( "Setting up token refresh..." );

        const expiresDate = new Date( accessTokenExpiresAt ).getTime();
        const now = Date.now();
        const timeUntilExpire = expiresDate - now;
        
        console.log( "Token expires at:", new Date( accessTokenExpiresAt ) );
        console.log( "Current time:", new Date( now ) );
        console.log( "Time until expire (ms):", timeUntilExpire );
        console.log( "Time until expire (minutes):", Math.round( timeUntilExpire / 60000 ) );

        const refreshTime = timeUntilExpire - 60 * 1000;
        
        console.log( "Refresh time (ms):", refreshTime );
        console.log( "Refresh time (minutes):", Math.round( refreshTime / 60000 ) );

        if ( refreshTime <= 0 )
        {
            console.log( "Token expired or close to expiry, refreshing immediately" );
            handleRefresh();
            return;
        }

        timerRef.current = setTimeout( () =>
        {
            console.log( "Timer triggered, refreshing token..." );
            handleRefresh();
        }, refreshTime );

        console.log( "Token refresh timer set for", Math.round( refreshTime / 60000 ), "minutes" );

        // Cleanup function
        return () =>
        {
            if ( timerRef.current )
            {
                clearTimeout( timerRef.current );
                timerRef.current = null;
            }
        };
    }, [ accessTokenExpiresAt, user, handleRefresh ] );

    return { handleRefresh };
};