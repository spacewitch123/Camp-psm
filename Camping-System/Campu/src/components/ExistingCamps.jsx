import React, { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar from "./Sidebar";
import { Link } from 'react-router-dom';

function ExistingCamps() {
    axios.defaults.withCredentials = true;
    const [camps, setCamps] = useState([]);
    const [filteredCamps, setFilteredCamps] = useState([]);
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        axios.get("http://localhost:3001/ExistingCamps")
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => {
                console.error("Error fetching existing camps:", error);
            });
    }, []);

    useEffect(() => {
        const newFilteredCamps = selectedType === ''
            ? camps
            : camps.filter(camp => camp.campType === selectedType);
        setFilteredCamps(newFilteredCamps);
    }, [selectedType, camps]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6 ml-64">
                <div className="mb-6">
                    <label htmlFor="campTypeFilter" className="mr-2">Filter by Type:</label>
                    <select
                        id="campTypeFilter"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">All</option>
                        <option value="RV">RV</option>
                        <option value="Forest Camp">Forest Camp</option>
                        <option value="Stay Home">Stay Home</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCamps.map((camp) => (
                        <div key={camp._id} className="bg-white p-4 rounded-lg shadow-md">
                            <Link to={`/updateDelete/${camp._id}`}>
                                <h3 className="text-xl font-bold">{camp.campName}</h3>
                                <p className="text-gray-700">Type: {camp.campType}</p>
                                <p className="text-gray-700">Price: {camp.price}</p>
                                <div className="mt-4">
                                    {camp.images.length > 0 && (
                                        <img
                                            src={`http://localhost:3001${camp.images[0]}`}
                                            alt={`Camp ${camp.campName} - Main Image`}
                                            className="w-full rounded-lg mb-2"
                                        />
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExistingCamps;
