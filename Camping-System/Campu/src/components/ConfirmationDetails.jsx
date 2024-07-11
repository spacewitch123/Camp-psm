import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ConfirmationDetails() {
    const location = useLocation();
    const { formData, camp, totalPrice, paymentIntent } = location.state || {};
    const navigate = useNavigate();
    const reservationSavedRef = useRef(false); // useRef to track if reservation is saved

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(); // Basic formatting
    };

    let paymentStatus = "Pending"; // Default status

    if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
            paymentStatus = "Paid";
        } else if (paymentIntent.status === "processing" || paymentIntent.status === "requires_payment_method") {
            paymentStatus = "Processing";
        } else {
            paymentStatus = "Failed";
        }
    }

    useEffect(() => {
        if (!reservationSavedRef.current) { // Check if reservation is already saved
            const saveReservation = async () => {
                try {
                    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
                    const response = await axios.post('http://localhost:3001/reservations', {
                        campId: camp._id,
                        formData,
                        totalPrice,
                        paymentStatus,
                        paymentIntent,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}` // Include the token in the headers
                        }
                    });
                    console.log(response.data.message);
                    reservationSavedRef.current = true; // Mark reservation as saved
                } catch (error) {
                    console.error('Error saving reservation:', error);
                }
            };

            saveReservation();
        }
    }, [camp, formData, totalPrice, paymentStatus, paymentIntent]);

    const handleBackToHome = () => {
        navigate('/CamperHomePage');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 p-4 shadow-lg">
                <div className="container mx-auto">
                    <h1 className="text-white text-2xl">Camping Reservation System</h1>
                </div>
            </nav>

            <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Confirmation</h2>
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold mb-2">Reservation Details</h3>
                            <p><span className="font-semibold">Camp Name:</span> {camp.campName}</p>
                            <p><span className="font-semibold">Camp Type:</span> {camp.campType}</p>
                            <p><span className="font-semibold">Name:</span> {formData.name}</p>
                            <p><span className="font-semibold">Mobile Number:</span> {formData.mobileNumber}</p>
                            <p><span className="font-semibold">Check-in Date:</span> {formatDate(formData.checkInDate)}</p>
                            <p><span className="font-semibold">Check-out Date:</span> {formatDate(formData.checkOutDate)}</p>
                            <p><span className="font-semibold">Guests:</span> {formData.numPeople} Person</p>
                            <p><span className="font-semibold">Units:</span> {formData.units} Units</p>
                            <p><span className="font-semibold">Price Per Unit:</span> {camp.price} RM</p>
                            <p><span className="font-semibold">Total Price:</span> {totalPrice} RM</p>
                            <p className="font-semibold">Payment Status:
                                <span className={
                                    paymentStatus === "Paid" ? "text-green-500" :
                                        paymentStatus === "Processing" ? "text-yellow-500" :
                                            "text-red-500"
                                }>  {paymentStatus}</span>
                            </p>
                        </div>
                        <button
                            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
                            onClick={handleBackToHome}
                        >
                            Back to Home
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Camp Details</h2>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Camp Details</h3>
                            <div className="bg-gray-100 rounded-lg p-4 shadow-inner">
                                <h4 className="text-lg font-bold mb-2">{camp.campName}</h4>
                                <p className="text-gray-600">Type: {camp.campType}</p>
                                <p className="text-gray-600">Units: {formData.units} ({camp.numberOfUnits} available)</p>
                                <p className="text-gray-600">Max Capacity: {camp.capacity} per unit</p>
                                <p className="text-gray-600">Price: RM {camp.price} per unit</p>
                                {camp.images && camp.images[0] && (
                                    <img
                                        src={`http://localhost:3001${camp.images[0]}`}
                                        alt={`Camp ${camp.campName}`}
                                        className="w-full h-40 object-cover mt-2 rounded-lg"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
