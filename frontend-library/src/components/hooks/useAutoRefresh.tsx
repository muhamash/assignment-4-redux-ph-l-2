import { useCallback, useEffect } from "react";
import { authApi } from "../redux/api/auth.api";
import { getCredentials, logout } from "../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";

export const useAutoRefresh = () =>
{
    const expiresAt = useAppSelector( ( state ) => state.auth.expiresAt );
    const dispatch = useAppDispatch();

    const handleRefresh = useCallback( async () =>
    {
        try
        {
            // Using the refreshToken mutation here
            const refreshResult = await dispatch( authApi.endpoints.refreshToken.initiate() ).unwrap();

            if ( refreshResult?.data )
            {
                dispatch(
                    getCredentials( {
                        user: refreshResult.data.user,
                        accessToken: refreshResult.data.accessToken,
                        // expiresAt: refreshResult.data.expiresAt,
                    } )
                );
            }
            else
            {
                dispatch( logout() );
            }
        }
        catch
        {
            dispatch( logout() );
        }
    }, [ dispatch ] );

    useEffect( () =>
    {
        if ( !expiresAt ) return;

        const expiresDate = new Date( expiresAt ).getTime();
        const now = Date.now();
        const timeUntilExpire = expiresDate - now;

        // Refresh 1 minute before expiry
        const refreshTime = timeUntilExpire - 60 * 1000;

        if ( refreshTime <= 0 )
        {
            // Token expired or close to expiry, refresh immediately
            handleRefresh();
            return;
        }

        const timer = setTimeout( () =>
        {
            handleRefresh();
        }, refreshTime );

        return () => clearTimeout( timer );
    }, [ expiresAt, handleRefresh ] );
};