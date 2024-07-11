import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

function Confirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, camp } = location.state || {};

    // Function to calculate the number of days between two dates
    const calculateDays = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, 'days') + 1; // Include the start date as a full day
    };

    // Calculate total price based on the number of days and units
    const numDays = calculateDays(formData.checkInDate, formData.checkOutDate);
    const totalPrice = camp.price * numDays * formData.units;

    const formatDate = (date) => {
        return moment(date).format('MMM DD YYYY');
    };

    const handleProceedToPayment = () => {
        // Redirect to the payment page
        navigate('/payment', { state: { formData, camp, totalPrice } });
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
                            <p><span className="font-semibold">Total Price for {numDays} {numDays > 1 ? 'Nights' : 'Night'}:</span> {totalPrice} RM</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Pay</h2>
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                            <p>Payment can be made using credit or debit cards.</p>
                            <p>Please note that your payment information will be securely processed.</p>
                            <p>By proceeding with the payment, you agree to our <a href="/terms" className="text-blue-500">Terms and Conditions</a>.</p>
                            <p>If you have any questions or concerns regarding the payment process, please <a href="/contact" className="text-blue-500">contact us</a>.</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4" onClick={handleProceedToPayment}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
