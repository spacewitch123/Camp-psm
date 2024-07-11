// CityCard.jsx
import React from 'react';

function CityCard({ city, image, description }) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={image} alt={city} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{city}</h3>
                <p className="text-gray-700">{description}</p>
            </div>
        </div>
    );
}

export default CityCard;
