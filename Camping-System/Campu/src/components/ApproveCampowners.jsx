import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';

function ApproveCampowners() {
    const [campowners, setCampowners] = useState([]);

    useEffect(() => {
        const fetchCampowners = async () => {
            try {
                const response = await axios.get('http://localhost:3001/campowners/pending', {
                    withCredentials: true,
                });
                setCampowners(response.data);
            } catch (error) {
                console.error('Error fetching camp owners:', error);
            }
        };

        fetchCampowners();
    }, []);

    const approveCampowner = async (id) => {
        try {
            await axios.post(`http://localhost:3001/campowners/approve/${id}`, {}, {
                withCredentials: true,
            });
            setCampowners(campowners.filter(campowner => campowner._id !== id));
        } catch (error) {
            console.error('Error approving camp owner:', error);
        }
    };

    const rejectCampowner = async (id) => {
        try {
            await axios.post(`http://localhost:3001/campowners/reject/${id}`, {}, {
                withCredentials: true,
            });
            setCampowners(campowners.filter(campowner => campowner._id !== id));
        } catch (error) {
            console.error('Error rejecting camp owner:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <AdminNav />
            <h2 className="text-3xl font-bold mb-6 text-center">Pending Camp Owners</h2>
            <div className="overflow-x-auto w-full max-w-4xl">
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Certificate</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campowners.map(campowner => (
                                <tr key={campowner._id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{campowner.fullName}</td>
                                    <td className="border px-4 py-2">{campowner.email}</td>
                                    <td className="border px-4 py-2">
                                        <a
                                            href={`http://localhost:3001/certificates/${campowner.certificate}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            View Certificate
                                        </a>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                                            onClick={() => approveCampowner(campowner._id)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                            onClick={() => rejectCampowner(campowner._id)}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ApproveCampowners;
