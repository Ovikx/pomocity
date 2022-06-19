import React, { useState } from 'react';
import axios from 'axios';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            email: email,
            username: username,
            password: password
        };

        // axios post request below
        axios.post('/sign-up/', data)
            .then(response => console.log(response))
            .catch(error => {
                alert(JSON.stringify(error.response.data));
            });
    }

    return (
        <div>
            <h1>Sign up here!</h1>
            <p>With an account, you'll be able to create a city full of your hard-earned skyscrapers.</p>
            <form onSubmit={handleSubmit}>
                <label>Email</label><br />
                <input type='email' onChange={(e) => {setEmail(e.target.value)}} /><br />
                <label>Username</label><br />
                <input type='text' onChange={(e) => {setUsername(e.target.value)}} /><br />
                <label>Password</label><br />
                <input type='password' onChange={(e) => {setPassword(e.target.value)}} /><br />
                <button type='submit'>Sign up</button>
            </form>
        </div>
    );
}