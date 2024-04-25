import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Camper.css';

function CampownerSignup() {
    // State for form inputs
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    // Handle signup form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/signupowner", { fullName, email, phoneNumber, password })
            .then(result => {
                console.log(result);
                window.alert("Signup successful!"); // Display alert on successful signup
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="Camper">
            <div className="signup-form">
                <h2>Camp Owner Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/CampownerLogin">Login</Link></p>
            </div>
        </div>
    );
}

export default CampownerSignup;
