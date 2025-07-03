import { useEffect } from "react";
import { authApi } from "../redux/api/auth.api";
import { getCredentials, logout } from "../redux/features/auth/authSlice";
import { useAppDispatch } from "./useRedux";

export const useInitAuth = () =>
{
    const dispatch = useAppDispatch();

    useEffect( () =>
    {
        const fetchUser = async () =>
        {
            try
            {
                const res = await dispatch( authApi.endpoints.refreshToken.initiate() ).unwrap();
                if ( res?.data )
                {
                    dispatch(
                        getCredentials( {
                            user: res.data.user,
                            accessToken: res.data.accessToken,
                        } )
                    );
                } else
                {
                    dispatch( logout() );
                }
            } catch
            {
                dispatch( logout() );
            }
        };

        fetchUser();
    }, [] );
};