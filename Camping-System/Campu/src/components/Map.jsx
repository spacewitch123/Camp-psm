import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const MapComponent = ({ selectedLocation, onClose, onSelectLocation }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
    });
    const mapRef = useRef();
    const autoCompleteRef = useRef(null);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!isLoaded) return;

        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
            document.getElementById("location-input"),
            {
                types: ["geocode"], // Restrict to geographical locations
                componentRestrictions: { country: "MY" }, // Restrict to Malaysia
            }
        );

        autoCompleteRef.current.addListener("place_changed", handlePlaceSelect);

        return () => {
            // Cleanup autocomplete instance
            window.google.maps.event.clearInstanceListeners(autoCompleteRef.current);
        };
    }, [isLoaded]);

    if (loadError) return "Error";
    if (!isLoaded) return "Maps";

    const handleMapClick = (event) => {
        onSelectLocation(event.latLng.toJSON()); // Pass the selected location to the parent component
    };

    const handleCloseMap = () => {
        onClose(); // Close the map when called
    };

    const handlePlaceSelect = () => {
        const place = autoCompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) return; // If no geometry, ignore

        const latLng = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };

        onSelectLocation(latLng); // Pass the selected location to the parent component
    };

    return (
        <div style={{ marginTop: "50px" }}>
            <input
                id="location-input"
                type="text"
                placeholder="Search for a location"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <GoogleMap
                mapContainerStyle={{ height: "800px" }}
                center={selectedLocation}
                zoom={13}
                onLoad={(map) => (mapRef.current = map)}
                onClick={handleMapClick} // Handle map click event
            >
                <MarkerF position={selectedLocation} />
            </GoogleMap>
            <button onClick={handleCloseMap}>Close Map</button> {/* Add a button to close the map */}
        </div>
    );
};

export default MapComponent;
