import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from '../api/auth.api';
import { booksApi } from '../api/books.api';
import authReducer from '../features/auth/authSlice';
import modalReducer from "../features/books/modalSlice";
import paginationReducer from "../features/books/paginationSlice";

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: [ 'user', 'accessToken', 'accessTokenExpiresAt' ],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore( {
    reducer: {
        auth: persistedAuthReducer,
        modal: modalReducer,
        pagination: paginationReducer,
        [ authApi.reducerPath ]: authApi.reducer,
        [booksApi.reducerPath] : booksApi.reducer,
    },
    middleware: ( getDefaultMiddleware ) =>
        getDefaultMiddleware( {
            serializableCheck: {
                ignoredActions: [ 'persist/PERSIST' ],
            },
        } ).concat( authApi.middleware, booksApi.middleware ),
} );

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;