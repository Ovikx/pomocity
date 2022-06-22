import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Collection } from './pages/Collection';
import { NoMatch } from './pages/NoMatch';

// Store
import { useAppDispatch } from './app/hooks';
import { setAuth } from './features/authorization/AuthSlice';

export const App = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    
    if (loading) {
        const authData = {
            username: localStorage.getItem('username'),
            token: localStorage.getItem('auth-token')
        };
    
        axios.post('/check-token/', authData)
            .then(response => {
                dispatch(setAuth(true));
                console.log('Logged in from App.tsx');
            })
            .catch(error => {
                dispatch(setAuth(false));
            })
            .finally(() => {
                setLoading(false);
            });

        return (
            <p style={{'textAlign': 'center'}}>Loading...</p>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path='/collection' element={<ProtectedRoute><Collection /></ProtectedRoute>} />
                <Route path='*' element={<NoMatch />} />
            </Routes>
        </BrowserRouter>
    )
}