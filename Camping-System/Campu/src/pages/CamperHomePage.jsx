import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchLocationInput from '../components/GooglePlcasesApi';
import { useNavigate } from 'react-router-dom';
import CustomerNav from '@/components/CustomerNav';
import CityCard from '../components/CityCard';
import kualaLumpurImage from '../assets/Kuala-Lumpur.webp';
import johorBahruImage from '../assets/Johor-Bahru.jpeg';
import malaccaImage from '../assets/Melaka.jpeg';
import terengganuImage from '../assets/Terangganu.jpeg';


function CamperHomePage() {
    const cities = [
        {
            name: 'Kuala Lumpur',
            image: kualaLumpurImage,
            description: 'Kuala Lumpur, the capital of Malaysia, offers a vibrant urban camping experience.',
        },
        {
            name: 'Johor Bahru',
            image: johorBahruImage,
            description: 'Johor Bahru, known for its beautiful parks and coastal areas, is perfect for camping.',
        },
        {
            name: 'Malacca',
            image: malaccaImage,
            description: 'Malacca, known for its rich history and cultural heritage, offers a unique camping experience with its historical landmarks and vibrant local culture.',
        },
        {
            name: 'Terengganu',
            image: terengganuImage,
            description: 'Terengganu, with its beautiful beaches and traditional Malay culture, is a perfect destination for a relaxing and scenic camping experience.',
        },
    ];
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null });
    const [numPeople, setNumPeople] = useState(1);
    const [reservation, setReservation] = useState({ success: false, message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/resultgetcamps', {
                checkInDate: checkInDate.toISOString().split('T')[0],
                checkOutDate: checkOutDate.toISOString().split('T')[0],
                location: selectedLocation,
                numPeople,
            });
            if (response.data.success) {
                setReservation({ success: true, message: 'Looking for Camps' });
                navigate('/campsfound', {
                    state: {
                        camps: response.data.camps,
                        city: response.data.city,
                        checkInDate: checkInDate.toISOString().split('T')[0],
                        checkOutDate: checkOutDate.toISOString().split('T')[0],
                        location: selectedLocation,
                        numPeople,
                    }
                });
            } else {
                setReservation({ success: false, message: 'Reservation failed. Try again.' });
            }
        } catch (error) {
            setReservation({ success: false, message: 'Error occurred. Try again later.' });
        }
    };

    console.log('checkInDate:', checkInDate);
    console.log('checkOutDate:', checkOutDate);
    console.log('numPeople:', numPeople);


    return (
        <div className="min-h-screen bg-gray-100">
            <CustomerNav />
            <div className="pt-24 container mx-auto py-8">
                <div className="bg-white shadow-md rounded p-6">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Camper</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Check-in Date:
                            </label>
                            <DatePicker
                                selected={checkInDate}
                                onChange={date => setCheckInDate(date)}
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Check-out Date:
                            </label>
                            <DatePicker
                                selected={checkOutDate}
                                onChange={date => setCheckOutDate(date)}
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Location:
                            </label>
                            <SearchLocationInput setSelectedLocation={setSelectedLocation} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Number of People:
                            </label>
                            <input
                                type="number"
                                value={numPeople}
                                onChange={(e) => setNumPeople(e.target.value)}
                                min="1"
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                            Find Camps
                        </button>
                    </form>
                    {reservation.message && (
                        <p className={`mt-4 ${reservation.success ? 'text-green-500' : 'text-red-500'}`}>
                            {reservation.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="relative z-20 bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Popular Cities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cities.map(city => (
                            <Link to={`/citysection?city=${encodeURIComponent(city.name)}`} key={city.name}>
                                <CityCard
                                    city={city.name}
                                    image={city.image}
                                    description={city.description}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CamperHomePage;
