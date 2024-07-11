import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as z from 'zod';
import moment from 'moment';

function Reservation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { camp = {}, city = '', reservationData } = location.state || {};

    const { checkInDate, checkOutDate, numPeople } = reservationData || {};

    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [mobileNumberError, setMobileNumberError] = useState('');
    const [checkInDateState, setCheckInDate] = useState(checkInDate ? new Date(checkInDate) : new Date());
    const [checkOutDateState, setCheckOutDate] = useState(checkOutDate ? new Date(checkOutDate) : new Date());
    const [numPeopleState, setNumPeople] = useState(numPeople || 1);
    const [units, setUnits] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])$/);
    const schema = z.object({
        phone: z.string().refine(value => phoneRegex.test(value), {
            message: 'Invalid Number!',
        }),
    });

    useEffect(() => {
        if (reservationData) {
            setLoading(false);
            calculateTotalPrice();
        }
    }, [reservationData, checkInDateState, checkOutDateState, units]);

    const calculateDays = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, 'days') + 1; // Include the start date as a full day
    };

    const calculateTotalPrice = () => {
        const numDays = calculateDays(checkInDateState, checkOutDateState);
        setTotalPrice(camp.price * numDays * units);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!name || !mobileNumber || !checkInDateState || !checkOutDateState || numPeopleState < 1 || units < 1) {
            alert('Please fill in all fields correctly.');
            return;
        }

        if (numPeopleState > camp.capacity * units) {
            alert(`Sorry, the camp can accommodate only up to ${camp.capacity * units} people for the selected units.`);
            return;
        }

        if (units > camp.numberOfUnits) {
            alert(`Sorry, the camp has only ${camp.numberOfUnits} units available.`);
            return;
        }

        const formData = {
            name,
            mobileNumber,
            checkInDate: checkInDateState,
            checkOutDate: checkOutDateState,
            numPeople: numPeopleState,
            units,
        };
        const validationResult = schema.safeParse({ phone: mobileNumber });
        if (!validationResult.success) {
            alert(validationResult.error.errors[0].message);
            return;
        }

        navigate('/confirmation', { state: { formData, camp, city } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 p-4 shadow-lg">
                <div className="container mx-auto">
                    <h1 className="text-white text-2xl">Camping Reservation System</h1>
                </div>
            </nav>
            <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Reservation Form</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="checkInDate" className="block text-gray-700">Check-in Date</label>
                                <DatePicker
                                    selected={checkInDateState}
                                    onChange={(date) => setCheckInDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full border rounded p-2"
                                    placeholderText="Check-in Date"
                                />
                            </div>
                            <div>
                                <label htmlFor="checkOutDate" className="block text-gray-700">Check-out Date</label>
                                <DatePicker
                                    selected={checkOutDateState}
                                    onChange={(date) => setCheckOutDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full border rounded p-2"
                                    placeholderText="Check-out Date"
                                />
                            </div>
                            <div>
                                <label htmlFor="numPeople" className="block text-gray-700">Number of People</label>
                                <input
                                    type="number"
                                    id="numPeople"
                                    value={numPeopleState}
                                    onChange={(e) => setNumPeople(e.target.value)}
                                    min="1"
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="units" className="block text-gray-700">Number of Units</label>
                                <input
                                    type="number"
                                    id="units"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                    min="1"
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="mobileNumber" className="block text-gray-700">Mobile Number</label>
                                <input
                                    type="text"
                                    id="mobileNumber"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
                                Reserve
                            </button>
                        </form>
                    </div>
                    <div className="bg-white max-w-lg mx-auto rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Camp Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer flex-grow w-96 h-96">
                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">{camp.campName}</h3>
                                <p className="text-gray-600 text-sm md:text-base lg:text-lg">Type: {camp.campType}</p>
                                <p className="text-gray-600 text-sm md:text-base lg:text-lg">Units: {camp.numberOfUnits} Units available</p>
                                <p className="text-gray-600 text-sm md:text-base lg:text-lg">Max Capacity: {camp.capacity} Per Unit</p>
                                <p className="text-gray-600 text-sm md:text-base lg:text-lg">Price: {camp.price} RM</p>
                                <p className="text-gray-600 text-sm md:text-base lg:text-lg">Total Price for {calculateDays(checkInDateState, checkOutDateState)} {calculateDays(checkInDateState, checkOutDateState) > 1 ? 'Nights' : 'Night'}: {totalPrice} RM</p>
                                {camp.images && camp.images[0] && (
                                    <img src={`http://localhost:3001${camp.images[0]}`} alt={`Camp ${camp.campName}`} className="w-full h-48 md:h-56 lg:h-64 object-cover mt-4" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reservation;
