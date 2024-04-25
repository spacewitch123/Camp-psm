import React, { useState } from 'react';
import axios from 'axios';
import './Camper.css';

function CampOwnerLogin() {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    // Handle login form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/loginowner", { email, password })
            .then(result => {
                console.log(result);
                window.alert("Login successful!");
                const redirectUrl = result.data.redirect;
                if (redirectUrl) {
                    window.location.href = redirectUrl; // Redirect to the specified URL
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="Camper">
            <div className="login-form">
                <h2>Camp Owner Login</h2>
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

export default CampOwnerLogin;
