import React from 'react';
import { Link } from 'react-router-dom';
import CityCard from './CityCard';
import backgroundVideo from '../assets/backgroundVideo.mp4';
import kualaLumpurImage from '../assets/Kuala-Lumpur.webp';
import johorBahruImage from '../assets/Johor-Bahru.jpeg';
import malaccaImage from '../assets/Melaka.jpeg';
import terengganuImage from '../assets/Terangganu.jpeg';
import logo from '../assets/Campinglogo.jpeg';
import detailedcamp from '../assets/detailedcamp.png';
import hassle from '../assets/Hasslefree.png';
import selection from '../assets/Selection.png';
import support from '../assets/Community.png';
import community from '../assets/Community.png';
import payment from '../assets/payment.png';

function Home() {
    const cities = [
        {
            name: 'Kuala Lumpur',
            image: kualaLumpurImage,
            description: 'Kuala Lumpur, the capital of Malaysia, offers a vibrant urban camping experience.',
        },
        {
            name: 'Johor Bahru',
            image: johorBahruImage,
            description: 'Johor Bahru, known for its beautiful parks and coastal areas, is perfect for camping.',
        },
        {
            name: 'Malacca',
            image: malaccaImage,
            description: 'Malacca, known for its rich history and cultural heritage, offers a unique camping experience with its historical landmarks and vibrant local culture.',
        },
        {
            name: 'Terengganu',
            image: terengganuImage,
            description: 'Terengganu, with its beautiful beaches and traditional Malay culture, is a perfect destination for a relaxing and scenic camping experience.',
        },
    ];

    return (
        <div>
            <div className="relative h-screen">
                <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
                    <source src={backgroundVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="relative z-10 bg-black bg-opacity-50 h-full flex items-center justify-center">
                    <div className="text-center text-white p-6 max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome To Camping System</h1>
                        <p className="text-lg md:text-2xl">Your one stop for finding and reserving camps across Malaysia.</p>
                    </div>
                </div>
            </div>
            <div className="relative z-20 bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Popular Cities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cities.map(city => (
                            <Link to={`/citysection?city=${encodeURIComponent(city.name)}`} key={city.name}>
                                <CityCard
                                    city={city.name}
                                    image={city.image}
                                    description={city.description}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="about-us-section flex flex-col lg:flex-row items-center justify-center mt-12 mx-8 lg:mx-32 p-6 bg-white shadow-md rounded-lg">
                <img src={logo} alt="About Us" className="w-full lg:w-1/3 rounded-lg shadow-lg mb-6 lg:mb-0 lg:mr-6" />
                <div className="about-us-content w-full lg:w-2/3">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">About Us</h2>
                    <p className="text-gray-700 mb-4">
                        We are not just an ordinary online booking platform; it's your passport to the great outdoors.
                        Founded in 2023 by a group of passionate campers who shared a common issue – the difficulty of finding and booking campsites in Malaysia,
                        <span className="font-bold"> Camping System </span> was born out of a love for adventure and a desire to make camping accessible, convenient, and enjoyable for everyone.
                    </p>
                    <a href="/about" className="text-green-600 hover:underline">Read more &rarr;</a>
                </div>
            </div>
            <div className="why-book-with-us bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Why Book With Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
                            <img src={selection} alt="Comprehensive Campsite Selection" className="h-16 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Comprehensive Campsite Selection</h3>
                            <p>Whether you're seeking the tranquility of the rainforest, the serenity of the beach, or the thrill of the highlands, you'll find a campsite that suits your preferences.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
                            <img src={hassle} alt="Hassle-Free Booking" className="h-16 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Hassle-Free Booking</h3>
                            <p>Our user-friendly platform makes booking your dream campsite a breeze. With just a few clicks, you can secure your spot and start counting down the days to your outdoor getaway.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
                            <img src={detailedcamp} alt="Detailed Campsite Information" className="h-16 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Detailed Campsite Information</h3>
                            <p>Each campsite listing on BOOKTAPAK comes with comprehensive information, including detailed descriptions, high-quality photos, and reviews from fellow campers.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
                            <img src={community} alt="Community Connection" className="h-16 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Community Connection</h3>
                            <p>Connect with fellow adventurers, share your experiences, and gain valuable insights into your upcoming trip.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
                            <img src={support} alt="Support for Campsite Owners" className="h-16 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Support for Campsite Owners</h3>
                            <p>List your campsite with us and gain exposure to a wide community of campers while streamlining your booking process.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
                            <img src={payment} alt="Secure and Convenient Payments" className="h-16 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Secure and Convenient Payments</h3>
                            <p>We offer secure payment options to ensure your financial information is protected during transactions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
