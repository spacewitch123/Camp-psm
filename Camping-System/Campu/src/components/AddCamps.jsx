import React, { useState } from "react";
import axios from 'axios';
import Sidebar from './Sidebar';
import MapComponent from './Map';
import SearchLocationInput from './GooglePlcasesApi';

function AddCamps() {
    axios.defaults.withCredentials = true;
    const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
    const [campName, setCampName] = useState('');
    const [city, setCity] = useState('');
    const [capacity, setCapacity] = useState('');
    const [price, setPrice] = useState('');
    const [files, setFiles] = useState([]);
    const [campType, setCampType] = useState('');
    const [numberOfUnits, setNumberOfUnits] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [socialMedia, setSocialMedia] = useState('');
    const [amenities, setAmenities] = useState('');
    const [isMapOpen, setIsMapOpen] = useState(false);
    // New state for city

    const handleLocationSelect = (selectedLocation) => {
        setSelectedLocation(selectedLocation);
        setIsMapOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('campName', campName);
        formData.append('city', city);
        formData.append('capacity', capacity);
        formData.append('price', price);
        formData.append('latitude', selectedLocation.lat);
        formData.append('longitude', selectedLocation.lng);
        formData.append('campType', campType);
        formData.append('numberOfUnits', numberOfUnits);
        formData.append('description', description);
        formData.append('phoneNumber', phoneNumber);
        formData.append('socialMedia', socialMedia); // Append city to formData
        const amenitiesArray = amenities.split(',').map(item => item.trim());
        formData.append('amenities', JSON.stringify(amenitiesArray));

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
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="ml-64 p-6 w-full">
                <h2 className="text-2xl font-bold mb-4">Add New Camp</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <SearchLocationInput setSelectedLocation={handleLocationSelect} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Camp Name</label>
                        <input
                            type="text"
                            placeholder="Camp Name"
                            value={campName}
                            onChange={(e) => setCampName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Camp Type</label>
                        <select
                            id="campType"
                            value={campType}
                            onChange={(e) => setCampType(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">Select Camp Type</option>
                            <option value="RV">RV</option>
                            <option value="Forest Camp">Forest Camp</option>
                            <option value="Stay Home">Stay Home</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Number of Units</label>
                        <input
                            type="number"
                            placeholder="Number of Units"
                            value={numberOfUnits}
                            onChange={(e) => setNumberOfUnits(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input
                            type="number"
                            placeholder="Capacity"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Social Media Link</label>
                        <input
                            type="text"
                            placeholder="Social Media Link"
                            value={socialMedia}
                            onChange={(e) => setSocialMedia(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated list)</label>
                        <textarea
                            placeholder="Amenities (comma-separated list)"
                            value={amenities}
                            onChange={(e) => setAmenities(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div className="file-names space-y-2">
                        {files.map((file, index) => (
                            <div key={index} className="text-sm text-gray-500">{file.name}</div>
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Add Camp</button>
                </form>

                {isMapOpen && (
                    <MapComponent
                        selectedLocation={selectedLocation}
                        onClose={() => setIsMapOpen(false)}
                        onSelectLocation={handleLocationSelect}
                    />
                )}
            </div>
        </div>
    );
}

export default AddCamps;
