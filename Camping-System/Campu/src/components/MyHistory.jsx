import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerNav from '@/components/CustomerNav';
import { useNavigate } from 'react-router-dom';

function MyHistory() {
    const [activeReservations, setActiveReservations] = useState([]);
    const [pastReservations, setPastReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:3001/myreservations');
                const currentDate = new Date();
                const active = [];
                const past = [];

                console.log('Fetched reservations:', response.data); // Debugging line

                response.data.forEach(reservation => {
                    const checkOutDate = new Date(reservation.formData.checkOutDate);
                    if (checkOutDate >= currentDate) {
                        active.push(reservation);
                    } else {
                        past.push(reservation);
                    }
                });

                setActiveReservations(active);
                setPastReservations(past);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setError('Error fetching reservations');
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleCancelReservation = async (reservationId) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            try {
                await axios.delete(`http://localhost:3001/reservations/${reservationId}`);
                setActiveReservations(prevReservations =>
                    prevReservations.filter(reservation => reservation._id !== reservationId)
                );
            } catch (error) {
                console.error('Error cancelling reservation:', error);
                setError('Error cancelling reservation');
            }
        }
    };

    const handleLeaveReview = (campId, campName) => {
        navigate('/review', { state: { campId, campName } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <CustomerNav />
            <div className="flex-grow mt-16 container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">My Reservations</h2>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Active Reservations</h3>
                    {activeReservations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeReservations.map((reservation) => (
                                <div key={reservation._id} className="bg-white shadow-md rounded p-4">
                                    <h4 className="text-lg font-semibold">{reservation.camp?.campName || 'Unknown Camp'}</h4>
                                    <p><strong>Check-in:</strong> {new Date(reservation.formData.checkInDate).toLocaleDateString()}</p>
                                    <p><strong>Check-out:</strong> {new Date(reservation.formData.checkOutDate).toLocaleDateString()}</p>
                                    <p><strong>Guests:</strong> {reservation.formData.numPeople}</p>
                                    <p><strong>Units:</strong> {reservation.formData.units}</p>
                                    <p><strong>Price:</strong> RM {reservation.totalPrice}</p>
                                    <p><strong>Status:</strong> {reservation.paymentStatus}</p>
                                    <button
                                        className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                                        onClick={() => handleCancelReservation(reservation._id)}
                                    >
                                        Cancel Reservation
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No active reservations found.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4">Past Reservations</h3>
                    {pastReservations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pastReservations.map((reservation) => (
                                <div key={reservation._id} className="bg-white shadow-md rounded p-4">
                                    <h4 className="text-lg font-semibold">{reservation.camp?.campName || 'Unknown Camp'}</h4>
                                    <p><strong>Check-in:</strong> {new Date(reservation.formData.checkInDate).toLocaleDateString()}</p>
                                    <p><strong>Check-out:</strong> {new Date(reservation.formData.checkOutDate).toLocaleDateString()}</p>
                                    <p><strong>Guests:</strong> {reservation.formData.numPeople}</p>
                                    <p><strong>Units:</strong> {reservation.formData.units}</p>
                                    <p><strong>Price:</strong> RM {reservation.totalPrice}</p>
                                    <p><strong>Status:</strong> {reservation.paymentStatus}</p>
                                    <button
                                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                        onClick={() => handleLeaveReview(reservation.camp?._id, reservation.camp?.campName)}
                                    >
                                        Leave a Review
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No past reservations found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyHistory;
