import React from 'react';
import { Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setAuth, selectAuth } from '../features/authorization/AuthSlice';

export const ProtectedRoute = ({children}: any) => {
    const auth = useAppSelector(selectAuth);

    return (
       auth
       ? children
       : <Navigate to='/login' />
    );
}