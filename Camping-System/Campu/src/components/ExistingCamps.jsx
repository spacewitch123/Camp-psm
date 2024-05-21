import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ExistingCamps.css';
import Sidebar from "./Sidebar";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function ExistingCamps() {
    axios.defaults.withCredentials = true;
    const [camps, setCamps] = useState([]);
    const [filteredCamps, setFilteredCamps] = useState([]); // State for filtered camps
    const [selectedType, setSelectedType] = useState(''); // State for selected filter


    useEffect(() => {
        // Fetch existing camps data from the server
        axios.get("http://localhost:3001/ExistingCamps")
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => {
                console.error("Error fetching existing camps:", error);
            });
    }, []);

    useEffect(() => {
        // Filter camps based on selected type
        const newFilteredCamps = selectedType === ''
            ? camps
            : camps.filter(camp => camp.campType === selectedType);
        setFilteredCamps(newFilteredCamps);
    }, [selectedType, camps]);


    // ExistingCamps.js

    return (
        <div className="existing-camps">
            <Sidebar />
            <div className="main-content">
                <div className="filter-container">
                    <label htmlFor="campTypeFilter">Filter by Type:</label>
                    <select
                        id="campTypeFilter"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="RV">RV</option>
                        <option value="Forest Camp">Forest Camp</option>
                        <option value="Stay Home">Stay Home</option>
                    </select>
                </div>

                {filteredCamps.map((camp, index) => (
                    <div key={camp._id} className="camp-card-container">
                        <Link to={`/updateDelete/${camp._id}`} className="camp-card" id={`camp-${index}`}>
                            <h3>{camp.campName}</h3>
                            <p>Type: {camp.campType}</p> {/* Display camp type */}
                            <p>Price: {camp.price}</p>
                            <div className="image-slideshow">
                                {camp.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:3001${image}`}
                                        alt={`Camp ${camp.campName} - Image ${index}`}
                                        className={index === 0 ? 'active' : ''}
                                    />
                                ))}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExistingCamps;

