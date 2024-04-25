import React from 'react';
import './Sidebar.css'; // Import your CSS file for styling

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Camp Owner Dashboard</h2>
            <ul>
                <li><a href="#">Existing Camps</a></li>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Earnings</a></li>
            </ul>
        </div>
    );
}

export default Sidebar;
