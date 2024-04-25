import React, { useState } from 'react';
import axios from 'axios';
import './Camper.css';

function CustomerLogin() {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    // Handle login form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/login", { email, password })
            .then(result => {
                console.log(result);
                window.alert("Login successful!"); // Display alert on successful signup
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="Camper">
            <div className="login-form">
                <h2>Camper Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
                <p>{loginMessage}</p>
            </div>
        </div>
    );
}

export default CustomerLogin;
