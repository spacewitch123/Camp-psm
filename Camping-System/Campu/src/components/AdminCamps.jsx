import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';

function AdminCamps() {
    const [camps, setCamps] = useState([]);

    useEffect(() => {
        const fetchCamps = async () => {
            try {
                const response = await axios.get('http://localhost:3001/admincamps', {
                    withCredentials: true,
                });
                setCamps(response.data);
            } catch (error) {
                console.error('Error fetching camps:', error);
            }
        };

        fetchCamps();
    }, []);

    const deleteCamp = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/camps/${id}`, {
                withCredentials: true,
            });
            setCamps(camps.filter(camp => camp._id !== id));
        } catch (error) {
            console.error('Error deleting camp:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
            <AdminNav />
            <h2 className="text-3xl font-bold mb-6">Camps</h2>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Camp Name</th>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">City</th>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Capacity</th>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camps.map((camp) => (
                            <tr key={camp._id} className="border-b border-gray-200">
                                <td className="py-4 px-6 text-sm">{camp.campName}</td>
                                <td className="py-4 px-6 text-sm">{camp.city}</td>
                                <td className="py-4 px-6 text-sm">{camp.capacity}</td>
                                <td className="py-4 px-6 text-sm">
                                    <button
                                        onClick={() => deleteCamp(camp._id)}
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

export default AdminCamps;
