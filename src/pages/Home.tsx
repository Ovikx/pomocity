import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectAuth } from '../features/authorization/AuthSlice';

export const Home = () => {
    const auth = useAppSelector(selectAuth);

    return (
        <div>
            <h1>PomoCity</h1>
            <p>Logged in: {String(auth)}</p>
        </div>
    );
};