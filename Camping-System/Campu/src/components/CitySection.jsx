import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

function CitySection() {
    const location = useLocation();
    const navigate = useNavigate();
    const { city } = queryString.parse(location.search);
    const [camps, setCamps] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchCamps = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/camps?city=${encodeURIComponent(city)}`);
                setCamps(response.data);
            } catch (error) {
                console.error(`Error fetching camps for ${city}:`, error);
            }
        };

        fetchCamps();
    }, [city]);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get('http://localhost:3001/checkAuth', { withCredentials: true });
                setIsAuthenticated(response.data.isAuthenticated);
            } catch (error) {
                console.error('Error checking authentication status:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    const handleCampClick = (camp) => {
        if (isAuthenticated) {
            navigate(`/campdetails/${camp._id}`, {
                state: {
                    camp,
                    reservationData: {
                        checkInDate: new Date(),
                        checkOutDate: new Date(),
                        numPeople: 1
                    }
                },
            });
        } else {
            alert('You need to log in to view camp details.');
        }
    };

    return (
        <div className="flex-grow py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">{city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {camps.length > 0 ? (
                    camps.map(camp => (
                        <div key={camp._id} className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer" onClick={() => handleCampClick(camp)}>
                            <img src={`http://localhost:3001${camp.images[0]}`} alt={camp.campName} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">{camp.campName}</h3>
                                <p className="text-gray-700">{camp.description}</p>
                                <p className="text-gray-900 font-bold mt-2">Price: RM {camp.price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-lg">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Camps Available</h3>
                        <p className="text-gray-600">Sorry, there are currently no camps available in this city. Please check back later or try a different city.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CitySection;
