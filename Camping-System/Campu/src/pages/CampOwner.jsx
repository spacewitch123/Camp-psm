import React from 'react';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import './CampOwner.css'; // Import the CSS file for styling

function CampOwnerHome() {
    return (
        <div className="campowner">
            <Sidebar />
            <div className="content">
                <h2>Welcome to CampOwner Dashboard</h2>
                <p></p>
            </div>
        </div>
    );
}

export default CampOwnerHome;
