import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Pages
import { Home } from './pages/Home';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}