import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';

function Campowners() {
    const [campowners, setCampowners] = useState([]);

    useEffect(() => {
        const fetchCampowners = async () => {
            try {
                const response = await axios.get('http://localhost:3001/campowners', {
                    withCredentials: true,
                });
                setCampowners(response.data);
            } catch (error) {
                console.error('Error fetching camp owners:', error);
            }
        };

        fetchCampowners();
    }, []);

    const deleteCampowner = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/campowners/${id}`, {
                withCredentials: true,
            });
            setCampowners(campowners.filter(campowner => campowner._id !== id));
        } catch (error) {
            console.error('Error deleting camp owner:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
            <AdminNav />
            <h2 className="text-3xl font-bold mb-6">Camp Owners</h2>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Email</th>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campowners.map((campowner) => (
                            <tr key={campowner._id} className="border-b border-gray-200">
                                <td className="py-4 px-6 text-sm">{campowner.fullName}</td>
                                <td className="py-4 px-6 text-sm">{campowner.email}</td>
                                <td className="py-4 px-6 text-sm">
                                    <button
                                        onClick={() => deleteCampowner(campowner._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Campowners;
