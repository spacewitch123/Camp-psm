import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchLocationInput from './GooglePlcasesApi';
import axios from 'axios';
import moment from 'moment';
import CustomerNav from './CustomerNav';

function CampsFound() {
    const location = useLocation();
    const { camps = [], city = '', checkInDate, checkOutDate, selectedLocation, numPeople } = location.state || {};

    const [checkInDateState, setCheckInDate] = useState(new Date(checkInDate || new Date()));
    const [checkOutDateState, setCheckOutDate] = useState(new Date(checkOutDate || new Date()));
    const [selectedLocationState, setSelectedLocation] = useState(selectedLocation || { lat: null, lng: null });
    const [numPeopleState, setNumPeople] = useState(numPeople || 1);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formattedCheckInDate = moment(checkInDateState).format('YYYY-MM-DD');
            const formattedCheckOutDate = moment(checkOutDateState).format('YYYY-MM-DD');

            const response = await axios.post('http://localhost:3001/resultgetcamps', {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                location: selectedLocationState,
                numPeople: numPeopleState,
            });

            if (response.data.success) {
                navigate('/campsfound', {
                    state: {
                        camps: response.data.camps,
                        city: response.data.city,
                        checkInDate: formattedCheckInDate,
                        checkOutDate: formattedCheckOutDate,
                        selectedLocation: selectedLocationState,
                        numPeople: numPeopleState,
                    },
                });
            } else {
                console.error('Failed to fetch camps:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const calculateDays = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, 'days') + 1; // Include the start date as a full day
    };

    useEffect(() => {
        console.log('Location State:', location.state);
    }, [location]);

    const handleCampClick = (camp) => {
        navigate(`/campdetails/${camp._id}`, {
            state: {
                camp,
                reservationData: {
                    checkInDate: moment(checkInDateState).format('YYYY-MM-DD'),
                    checkOutDate: moment(checkOutDateState).format('YYYY-MM-DD'),
                    numPeople: numPeopleState,
                },
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <CustomerNav />
            <div className="container mx-auto py-24"> {/* Add top padding to push content below navbar */}
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 justify-center items-center mb-8 p-4 bg-white rounded-lg shadow-md">
                    <div className="w-full md:w-1/5">
                        <DatePicker
                            selected={checkInDateState}
                            onChange={(date) => setCheckInDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="w-full border rounded p-2"
                            placeholderText="Check-in Date"
                        />
                    </div>
                    <div className="w-full md:w-1/5">
                        <DatePicker
                            selected={checkOutDateState}
                            onChange={(date) => setCheckOutDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="w-full border rounded p-2"
                            placeholderText="Check-out Date"
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <SearchLocationInput setSelectedLocation={setSelectedLocation} />
                    </div>
                    <div className="w-full md:w-1/6">
                        <input
                            type="number"
                            value={numPeopleState}
                            onChange={(e) => setNumPeople(e.target.value)}
                            min="1"
                            className="w-full border rounded p-2"
                            placeholder="Number of People"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                        Filter
                    </button>
                </form>

                <div className="container mx-auto py-8">
                    <h2 className="text-2xl font-bold mb-4">Camps Found</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {camps.length > 0 ? (
                            camps.map((camp, index) => {
                                const numDays = calculateDays(checkInDateState, checkOutDateState);
                                const totalPrice = camp.price * numDays;

                                return (
                                    <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer" onClick={() => handleCampClick(camp)}>
                                        <h3 className="text-xl font-bold">{camp.campName}</h3>
                                        <p className="text-gray-600">Type: {camp.campType}</p>
                                        <p className="text-gray-600">Total Price for {numDays} {numDays > 1 ? 'Nights' : 'Night'}: {totalPrice} RM</p>
                                        <p className="text-gray-600">City: {city}</p>
                                        {camp.images && camp.images[0] && (
                                            <img src={`http://localhost:3001${camp.images[0]}`} alt={`Camp ${camp.campName}`} className="w-full h-48 object-cover mt-4" />
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>No camps found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampsFound;