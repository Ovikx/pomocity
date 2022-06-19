import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cookies = new Cookies();
        const data = {
            username: username,
            password: password
        };
        axios.post('/login/', data)
            .then(response => {
                cookies.set('username', data.username, {path: '/'});
                cookies.set('auth-token', response.data['new-auth-token'], {path: '/'});
                navigate('/', {replace: true});
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div>
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label><br />
                <input type='text' onChange={e => setUsername(e.target.value)} /><br />
                <label>Password</label><br />
                <input type='password' onChange={e => setPassword(e.target.value)} /><br />
                <button type='submit'>Log in</button>
            </form>
        </div>
    );
}