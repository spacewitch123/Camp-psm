import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function AdminNav() {
    axios.defaults.withCredentials = true;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

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
        <nav className="bg-gray-800 p-4 shadow-lg w-full fixed top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex space-x-4 items-center">
                    <Link to="/admindashboard" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Dashboard</Link>
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="text-white hover:bg-gray-700 px-3 py-2 rounded inline-flex items-center"
                        >
                            <span>Users</span>
                            <svg
                                className="ml-1 w-4 h-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <Link
                                    to="/customer"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Customer
                                </Link>
                                <Link
                                    to="/campowners"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Campowner
                                </Link>
                                <Link to="/approve-campowners" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Approve Campowners</Link>
                            </div>
                        )}
                    </div>
                    <Link to="/AdminCamps" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Camps</Link>
                    <button onClick={handleLogout} className=" text-white hover:bg-gray-700 px-3 py-2 rounded">Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default AdminNav;
