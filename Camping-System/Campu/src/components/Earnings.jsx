import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "./Sidebar";

function Earnings() {
    const [campEarnings, setCampEarnings] = useState([]);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const ownerId = localStorage.getItem('ownerId'); // Retrieve the ownerId from local storage
                if (ownerId) {
                    const response = await axios.get('http://localhost:3001/earnings/owner', {
                        params: { ownerId } // Pass ownerId as query parameter
                    });
                    if (Array.isArray(response.data)) {
                        setCampEarnings(response.data);
                    } else {
                        console.error('Response data is not an array:', response.data);
                    }
                } else {
                    console.error('No owner ID found');
                }
            } catch (error) {
                console.error('Error fetching earnings:', error); // Handle error (e.g., display message to user)
            }
        };

        fetchEarnings();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 ml-64">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Total Earnings</h2>
                        <p className="text-lg font-semibold">
                            RM {Array.isArray(campEarnings) ? campEarnings.reduce((sum, week) => sum + week.earnings, 0) : 0}
                        </p>
                        <ul className="space-y-4">
                            {Array.isArray(campEarnings) && campEarnings.map((week, index) => (
                                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                    <p><span className="font-semibold">Camp:</span> {week.campName}</p>
                                    <p><span className="font-semibold">Earnings:</span> RM {week.earnings}</p>
                                    {week.reservations.map((reservation, i) => (
                                        <div key={i} className="mt-2">
                                            <p><span className="font-semibold">Name:</span> {reservation.formData.name}</p>
                                            <p><span className="font-semibold">Check-in Date:</span> {new Date(reservation.formData.checkInDate).toLocaleDateString()}</p>
                                            <p><span className="font-semibold">Check-out Date:</span> {new Date(reservation.formData.checkOutDate).toLocaleDateString()}</p>
                                            <p><span className="font-semibold">Total Price:</span> RM {reservation.totalPrice}</p>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Reservation Details</h2>
                        <ul className="space-y-4">
                            {Array.isArray(campEarnings) && campEarnings.map((week, index) => (
                                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                    {week.reservations.map((reservation, i) => (
                                        <div key={i} className="mt-2">
                                            <p><span className="font-semibold">Name:</span> {reservation.formData.name}</p>
                                            <p><span className="font-semibold">Mobile Number:</span> {reservation.formData.mobileNumber}</p>
                                            <p><span className="font-semibold">Check-in Date:</span> {new Date(reservation.formData.checkInDate).toLocaleDateString()}</p>
                                            <p><span className="font-semibold">Check-out Date:</span> {new Date(reservation.formData.checkOutDate).toLocaleDateString()}</p>
                                            <p><span className="font-semibold">Guests:</span> {reservation.formData.numPeople} Guests</p>
                                            <p><span className="font-semibold">Units:</span> {reservation.formData.units} Unit</p>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Earnings;
