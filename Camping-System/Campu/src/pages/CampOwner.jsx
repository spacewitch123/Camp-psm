import React from 'react';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import './CampOwner.css'; // Import the CSS file for styling

function CampOwnerHome() {
    return (
        <div className="campowner">
            <Sidebar />
            <div className="content">
                {/* Content for the CampOwner dashboard */}
                {/* You can add components for "Existing Camps", "Profile", and "Earnings" here */}
                <h2>Welcome to CampOwner Dashboard</h2>
            </div>
        </div>
    );
}

export default CampOwnerHome;
