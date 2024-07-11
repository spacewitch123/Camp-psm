import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CustomerNav() {
    axios.defaults.withCredentials = true;

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await axios.get('http://localhost:3001/logout', { withCredentials: true });
                window.location.href = '/';
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md fixed w-full z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/CamperHomePage" className="text-2xl font-bold mr-6 hover:bg-gray-700 px-3 py-2 rounded">
                        Camping Ground Booking System
                    </Link>
                </div>
                <ul className="flex space-x-4 items-center">
                    <li>
                        <Link to="/CustomerProfile" className="hover:bg-gray-700 px-3 py-2 rounded">Profile</Link>
                    </li>
                    <li>
                        <Link to="/MyHistory" className="hover:bg-gray-700 px-3 py-2 rounded">My History</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="hover:bg-gray-700 px-3 py-2 rounded">Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default CustomerNav;
