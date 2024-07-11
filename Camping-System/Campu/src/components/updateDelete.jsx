import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./updateDelete.css";

function UpdateDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [camp, setCamp] = useState({
        campName: "",
        capacity: "",
        price: "",
        latitude: "",
        longitude: "",
        images: [],
        campType: "",          // New
        numberOfUnits: "",      // New
        description: "",
        phoneNumber: "",
        socialMedia: "",
        amenities: [],          // New (initialize as an empty array)
    });

    const [address, setAddress] = useState('');
    const [allAmenities, setAllAmenities] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/camps/${id}`)
            .then((response) => {
                setCamp(response.data);
                fetchAddress(response.data.latitude, response.data.longitude);

                // Use the amenities directly from the fetched camp data
                setAllAmenities(response.data.amenities || []); // Handle the case where amenities might be undefined 
            })
            .catch((error) => {
                console.error("Error fetching camp details:", error);
            });
    }, [id]);

    const fetchAddress = (latitude, longitude) => {
        axios.get(`http://localhost:3001/api/geocode/json?latitude=${latitude}&longitude=${longitude}`)
            .then((response) => {
                if (response.data.results && response.data.results.length > 0) {
                    setAddress(response.data.results[0].formatted_address);
                } else {
                    console.error("No address found for the provided coordinates.");
                }
            })
            .catch((error) => {
                console.error("Error fetching address:", error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "amenities") {
            // Store amenities as a comma-separated string
            setCamp((prevCamp) => ({
                ...prevCamp,
                amenities: value.split(','),
            }));
        } else {
            setCamp((prevCamp) => ({
                ...prevCamp,
                [name]: value,
            }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/camps/${id}`,
            {
                ...camp,
                amenities: camp.amenities.join(','),
            }
        )
            .then((response) => {
                console.log("Camp updated successfully:", response.data);
                navigate("/ExistingCamps");
            })
            .catch((error) => {
                console.error("Error updating camp:", error);
            });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`http://localhost:3001/camps/${id}`)
            .then((response) => {
                console.log("Camp deleted successfully:", response.data);
                navigate("/ExistingCamps");
            })
            .catch((error) => {
                console.error("Error deleting camp:", error);
            });
    };

    return (
        <div className="update-delete"><Sidebar />
            <div className="content">
                <h2>Edit Camp</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Camp Name:
                        <input
                            type="text"
                            name="campName"
                            value={camp.campName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="campType">Camp Type:</label>
                    <select id="campType" name="campType" value={camp.campType} onChange={handleChange}>
                        <option value="">Select Camp Type</option>
                        <option value="RV">RV</option>
                        <option value="Forest Camp">Forest Camp</option>
                        <option value="Stay Home">Stay Home</option>
                    </select>

                    <label htmlFor="numberOfUnits">Number of Units:</label>
                    <input type="number" name="numberOfUnits" value={camp.numberOfUnits} onChange={handleChange} />
                    <label>
                        Capacity:
                        <input
                            type="number"
                            name="capacity"
                            value={camp.capacity}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={camp.price}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={address}
                            onChange={handleChange} // Assuming you want to allow editing of the address
                            required
                        />
                    </label>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input type="tel" name="phoneNumber" value={camp.phoneNumber} onChange={handleChange} />

                    <label htmlFor="socialMedia">Social Media:</label>

                    <input type="text" name="socialMedia" value={camp.socialMedia} onChange={handleChange} />

                    <label htmlFor="amenities">Amenities (comma-separated):</label>
                    <input
                        type="text"
                        id="amenities"
                        name="amenities"
                        defaultValue={camp.amenities.join(',')}  // Use defaultValue instead of value
                        onChange={handleChange}
                    />
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={camp.description} onChange={handleChange} />


                    <div className="existing-images">
                        <h3>Existing Images</h3>
                        {camp.images.map((image, index) => (
                            <img
                                key={index}
                                src={`http://localhost:3001${image}`}
                                alt={`Camp ${camp.campName} - Image ${index}`}
                                className="camp-image"
                            />
                        ))}
                    </div>
                    <button type="submit">Update Camp</button>
                </form>
                <button onClick={handleDelete} className="delete-button">
                    Delete Camp
                </button>
            </div>
        </div>
    );
}

export default UpdateDelete;