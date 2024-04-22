import React, { useState } from 'react';
import './Camper.css';

function Camper() {
    // State for form inputs
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // Handle signup form submission
    const handleSignupSubmit = (event) => {
        event.preventDefault();
        // Handle signup logic here
        console.log('Signup data:', signupData);
    };

    // Handle login form submission
    const handleLoginSubmit = (event) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Login data:', loginData);
    };

    return (
        <div className="Camper">
            <div className="signup-form">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignupSubmit}>
                    <input type="text" placeholder="Username" value={signupData.username} onChange={(e) => setSignupData({ ...signupData, username: e.target.value })} />
                    <input type="email" placeholder="Email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
                    <input type="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                    <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Camper;
