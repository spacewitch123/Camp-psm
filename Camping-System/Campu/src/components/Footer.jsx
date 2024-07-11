import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                <div className="text-sm text-center md:text-left">
                    &copy; {new Date().getFullYear()} UTM. All rights reserved.
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="/about" className="hover:text-gray-300">About Us</a>
                    <a href="/contact" className="hover:text-gray-300">Contact Us</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
