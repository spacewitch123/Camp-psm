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
        <div className="add-camp">
            <Sidebar />
            <h2>Add New Camp</h2>
            <form onSubmit={handleSubmit}>
                <SearchLocationInput setSelectedLocation={handleLocationSelect} />
                <input type="text" placeholder="Camp Name" value={campName} onChange={(e) => setCampName(e.target.value)} />
                <input type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="file" multiple onChange={handleFileUpload} />

                {/* Display file names */}
                <div className="file-names">
                    {files.map((file, index) => (
                        <div key={index}>{file.name}</div>
                    ))}
                </div>

                <button type="submit">Add Camp</button>
            </form>
            {isMapOpen && (
                <MapComponent
                    selectedLocation={selectedLocation}
                    onClose={() => setIsMapOpen(false)}
                    onSelectLocation={handleLocationSelect}
                />
            )}
        </div>
    );
}

export default AddCamps;
