import React, { useState } from "react";
import axios from 'axios';
import './AddCamps.css';
import Sidebar from './Sidebar';
import MapComponent from './Map';
import SearchLocationInput from './GooglePlcasesApi';

function AddCamps() {
    axios.defaults.withCredentials = true;
    const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
    const [campName, setCampName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [price, setPrice] = useState('');
    const [files, setFiles] = useState([]); // State to store selected files
    const [campType, setCampType] = useState(''); // New state for camp type
    const [numberOfUnits, setNumberOfUnits] = useState(''); // New state for number of units
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [socialMedia, setSocialMedia] = useState('');
    const [amenities, setAmenities] = useState('');
    const [isMapOpen, setIsMapOpen] = useState(false);
    const handleLocationSelect = (selectedLocation) => {
        setSelectedLocation(selectedLocation);
        setIsMapOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('campName', campName);
        formData.append('capacity', capacity);
        formData.append('price', price);
        formData.append('latitude', selectedLocation.lat);
        formData.append('longitude', selectedLocation.lng);
        formData.append('campType', campType);
        formData.append('numberOfUnits', numberOfUnits);
        formData.append('description', description);
        formData.append('phoneNumber', phoneNumber);
        formData.append('socialMedia', socialMedia);
        const amenitiesArray = amenities.split(',').map(item => item.trim());
        formData.append('amenities', JSON.stringify(amenitiesArray));



        // Append all selected files to formData with the key 'images'
        files.forEach(file => {
            formData.append('images', file);
        });

        axios.post("http://localhost:3001/NewCamp", formData)
            .then(result => {
                console.log(result);
                window.alert("Camp added successfully!");
            })
            .catch(err => console.error(err));
    };

    const handleFileUpload = (e) => {
        // Get the selected files from input
        const selectedFiles = Array.from(e.target.files);
        // Update the files state with the selected files
        setFiles(selectedFiles);
    };

    return (
        <div className="app-container">
            <div className="add-camp">
                <Sidebar />
                <div className="main-content"> {/* Correctly placed */}
                    <h2>Add New Camp</h2>
                    <form onSubmit={handleSubmit}>
                        <SearchLocationInput setSelectedLocation={handleLocationSelect} />
                        <input type="text" placeholder="Camp Name" value={campName} onChange={(e) => setCampName(e.target.value)} />
                        <label htmlFor="campType"></label>
                        <select id="campType" value={campType} onChange={(e) => setCampType(e.target.value)}>
                            <option value="">Select Camp Type</option>
                            <option value="RV">RV</option>
                            <option value="Forest Camp">Forest Camp</option>
                            <option value="Stay Home">Stay Home</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Number of Units"
                            value={numberOfUnits}
                            onChange={(e) => setNumberOfUnits(e.target.value)}
                        />
                        <input type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Social Media Link"
                            value={socialMedia}
                            onChange={(e) => setSocialMedia(e.target.value)}
                        />

                        <textarea
                            placeholder="Amenities (comma-separated list)"
                            value={amenities}
                            onChange={(e) => setAmenities(e.target.value)}
                        ></textarea>

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <input type="file" multiple onChange={handleFileUpload} />

                        {/* Display file names */}
                        <div className="file-names">
                            {files.map((file, index) => (
                                <div key={index}>{file.name}</div>
                            ))}
                        </div>

                        <button type="submit">Add Camp</button>
                    </form>

                    {/* The map component can be inside or outside the main-content depending on your preference */}
                    {isMapOpen && (
                        <MapComponent
                            selectedLocation={selectedLocation}
                            onClose={() => setIsMapOpen(false)}
                            onSelectLocation={handleLocationSelect}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
export default AddCamps;