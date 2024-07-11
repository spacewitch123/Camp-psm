import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function CampownerSignup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [certificate, setCertificate] = useState(null); // State for file upload
    const [signupMessage, setSignupMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation regex: at least 6 characters, one special character, and one uppercase letter
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
        if (!passwordRegex.test(password)) {
            setSignupMessage('Password must be at least 6 characters long, include one special character, and one uppercase letter.');
            return;
        }

        // Phone number validation regex: validate phone number format (basic example, can be adjusted)
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setSignupMessage('Phone number must be between 10 to 15 digits.');
            return;
        }

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phoneNumber', phoneNumber);
        formData.append('password', password);
        formData.append('certificate', certificate);

        try {
            const result = await axios.post("http://localhost:3001/signupowner", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(result);
            window.alert("Details Sent To Admin For Verification!");
        } catch (err) {
            console.log(err);
            setSignupMessage('Signup failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Camp Owner Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="file"
                        onChange={(e) => setCertificate(e.target.files[0])}
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
                    Already have an account? <Link to="/CampownerLogin" className="text-blue-600 hover:underline">Login</Link>
                </p>

            </div>
        </div>
    );
}

export default CampownerSignup;
