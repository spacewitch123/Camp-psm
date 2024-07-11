import React from 'react';

function CampOwnerHome() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Camp Owner Dashboard</h2>
                <nav className="space-y-4">
                    <a href="/profile" className="block py-2 px-4 rounded hover:bg-gray-700">Profile</a>
                    <a href="/addcamps" className="block py-2 px-4 rounded hover:bg-gray-700">Add Camps</a>
                    <a href="/existingcamps" className="block py-2 px-4 rounded hover:bg-gray-700">Existing Camps</a>
                    <a href="/earnings" className="block py-2 px-4 rounded hover:bg-gray-700">Earnings</a>
                    <a href="/logout" className="block py-2 px-4 rounded hover:bg-gray-700">Logout</a>
                </nav>
            </div>
            <div className="flex-grow p-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">Welcome to the Camp Owner Dashboard</h2>
                    <p className="text-gray-700 mb-6">Manage your campgrounds, view reservations, and update your profile.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Manage Camps</h3>
                            <p className="text-gray-700">Add, update, or remove campgrounds from your listings.</p>
                            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                Manage Camps
                            </button>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">View Reservations</h3>
                            <p className="text-gray-700">Check upcoming reservations and manage bookings.</p>
                            <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                View Reservations
                            </button>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
                            <p className="text-gray-700">Edit your profile information and change your password.</p>
                            <button className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                                Update Profile
                            </button>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Check Earnings</h3>
                            <p className="text-gray-700">View your earnings and financial reports.</p>
                            <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                Check Earnings
                            </button>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Support</h3>
                            <p className="text-gray-700">Get help and support for any issues or questions.</p>
                            <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                Get Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampOwnerHome;
