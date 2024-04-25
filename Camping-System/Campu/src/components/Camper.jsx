import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Camper.css';

function Camper() {
    // State for form inputs
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle signup form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/signup", { username, email, password })
            .then(result => {
                console.log(result);
                window.alert("Signup successful!"); // Display alert on successful signup
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="Camper">
            <div className="signup-form">
                <h2>Camper Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/CustomerLogin">Login</Link></p>
            </div>
        </div>
    );
}

export default Camper;
