import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Camper.css';

function Camper() {
    // State for form inputs
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupMessage, setSignupMessage] = useState('');

    // Handle signup form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Password validation regex: at least 6 characters, one special character, and one uppercase letter
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
        if (!passwordRegex.test(password)) {
            setSignupMessage('Password must be at least 6 characters long, include one special character, and one uppercase letter.');
            return;
        }

        axios.post("http://localhost:3001/signup", { username, email, password })
            .then(result => {
                console.log(result);
                window.alert("Signup successful!"); // Display alert on successful signup
                setSignupMessage(''); // Clear the signup message if signup is successful
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.data && err.response.data.message === "Username already exists") {
                    setSignupMessage('Username already exists. Please choose another username.');
                } else if (err.response && err.response.data && err.response.data.message === "Email already exists") {
                    setSignupMessage('Email already exists. Please use another email.');
                } else {
                    setSignupMessage('Signup failed. Please try again.');
                }
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Camper Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>
                {signupMessage && (
                    <p className="mt-4 text-red-600 bg-red-100 border border-red-400 p-3 rounded-lg text-center">
                        {signupMessage}
                    </p>
                )}
                <p className="mt-6 text-center">
                    Already have an account? <Link to="/CustomerLogin" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Camper;
