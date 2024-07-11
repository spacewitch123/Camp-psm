import React from 'react';
import axios from 'axios';

function Sidebar() {
    axios.defaults.withCredentials = true;

    // Function to handle logout
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
        <div className="bg-gray-900 text-white w-64 min-h-screen p-4 fixed">
            <h2 className="text-xl font-bold mb-6">Camp Owner Dashboard</h2>
            <ul className="space-y-4">
                <li><a href="/Profile" className="block py-2 px-4 rounded hover:bg-gray-700">Profile</a></li>
                <li><a href="/AddCamps" className="block py-2 px-4 rounded hover:bg-gray-700">Add Camps</a></li>
                <li><a href="/ExistingCamps" className="block py-2 px-4 rounded hover:bg-gray-700">Existing Camps</a></li>
                <li><a href="/Earnings" className="block py-2 px-4 rounded hover:bg-gray-700">Earnings</a></li>
                <li><a href="#" onClick={handleLogout} className="block py-2 px-4 rounded hover:bg-gray-700">Logout</a></li>
            </ul>
        </div>
    );
}

export default Sidebar;
