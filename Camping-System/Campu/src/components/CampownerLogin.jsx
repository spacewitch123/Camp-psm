import React, { useState } from 'react';
import axios from 'axios';

function CampOwnerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/loginowner", { email, password })
            .then(result => {
                console.log(result);
                window.alert("Login successful!");
                const { ownerId, token, redirect } = result.data; // Adjust based on actual response structure
                if (ownerId) {
                    localStorage.setItem('ownerId', ownerId);
                }
                if (token) {
                    localStorage.setItem('token', token);
                }
                if (redirect) {
                    window.location.href = redirect; // Redirect to the specified URL
                }
            })
            .catch(err => {
                console.error(err);
                setLoginMessage('Login failed. Please check your credentials and try again.');
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Camp Owner Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        Login
                    </button>
                </form>
                {loginMessage && (
                    <p className="mt-4 text-red-600 bg-red-100 border border-red-400 p-3 rounded-lg text-center">
                        {loginMessage}
                    </p>
                )}
            </div>
        </div>
    );
}

export default CampOwnerLogin;
