import React from 'react';
import './navbar.css';

function Navbar() {
    return (
        <div className="Navbar">
            <div className="Title">Camping Ground Booking System</div>
            <div className="options">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/Camper">Camper</a></li>
                    <li>Camp Owner</li>

                </ul>
            </div>
        </div>
    );
}

export default Navbar;
