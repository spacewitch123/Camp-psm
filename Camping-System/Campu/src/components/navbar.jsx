import React from 'react';

function Navbar() {
    return (
        <nav className="bg-gray-800 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="text-2xl font-bold">Camping Ground Booking System</div>
                <ul className="flex space-x-6">
                    <li>
                        <a href="/" className="hover:text-gray-300">Home</a>
                    </li>
                    <li>
                        <a href="/about" className="hover:text-gray-300">About</a>
                    </li>
                    <li>
                        <a href="/Camper" className="hover:text-gray-300">Camper</a>
                    </li>
                    <li>
                        <a href="/CampownerSignup" className="hover:text-gray-300">Camper Owner</a>
                    </li>
                    <li>
                        <a href="/AdminLogin" className="hover:text-gray-300">Admin Login</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
