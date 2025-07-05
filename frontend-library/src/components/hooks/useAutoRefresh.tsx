import { useCallback, useEffect } from "react";
import { authApi } from "../redux/api/auth.api";
import { getCredentials, logout } from "../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";

export const useAutoRefresh = () =>
{
    const { accessTokenExpiresAt, user } = useAppSelector( ( state ) => state.auth );
    console.log( accessTokenExpiresAt, user );
    
    const dispatch = useAppDispatch();

    const handleRefresh = useCallback( async () =>
    {
        try
        {
            const refreshResult = await dispatch( authApi.endpoints.refreshToken.initiate() ).unwrap();

            console.log( refreshResult?.data )

            if ( refreshResult?.data )
            {
                dispatch(
                    getCredentials( {
                        user: refreshResult.data.user,
                        accessToken: refreshResult.data.accessToken,
                        accessTokenExpiresAt: refreshResult.data.accessTokenExpiresAt,
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
        if ( !accessTokenExpiresAt || !user ) return;

        console.log( "Refreshing the token!!" )

        const expiresDate = new Date( accessTokenExpiresAt ).getTime();
        const now = Date.now();
        const timeUntilExpire = expiresDate - now;

        // Refresh 1 minute before expiry
        const refreshTime = timeUntilExpire - 60 * 1000;
        console.log( refreshTime, expiresDate )

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

        console.log( "token refreshed" )

        return () => clearTimeout( timer );
    }, [ accessTokenExpiresAt, user, handleRefresh ] );
};