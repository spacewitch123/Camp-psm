import React from 'react';

function About() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
            <div className="relative w-full max-w-4xl mb-8">
                <img
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080"
                    alt="Beautiful Camping Scene"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <h1 className="text-white text-4xl font-bold">About Us</h1>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-700 text-lg mb-4">
                    This system is developed by UTM to provide a complete streamlined process for booking camps across Malaysia. We aim to connect nature enthusiasts with the best camping spots, ensuring a seamless and enjoyable experience.
                </p>
                <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                <ul className="list-disc list-inside text-gray-700 text-lg mb-4">
                    <li>Easy and convenient camp booking process</li>
                    <li>Detailed information on various camping sites</li>
                    <li>User reviews and ratings for informed decision-making</li>
                    <li>Secure payment options</li>
                    <li>Responsive customer support</li>
                </ul>
                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-gray-700 text-lg">
                    We envision a world where camping enthusiasts can easily find and book their ideal camping spots, fostering a deeper connection with nature and promoting outdoor activities. Our goal is to make camping accessible and enjoyable for everyone, creating unforgettable experiences in the great outdoors.
                </p>
            </div>
        </div>
    );
}

export default About;
