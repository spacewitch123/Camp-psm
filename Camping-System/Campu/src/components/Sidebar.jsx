import React from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import './Sidebar.css'; // Import your CSS file for styling

function Sidebar() {
    axios.defaults.withCredentials = true;
    // Function to handle logout
    const handleLogout = async () => {
        // Ask for confirmation
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await axios.get('http://localhost:3001/logout', { withCredentials: true });
                // Redirect to the home page after logout
                window.location.href = '/';
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    };

    return (
        <div className="sidebar">
            <h2>Camp Owner Dashboard</h2>
            <ul>
                <li><a href="/Profile">Profile</a></li>
                <li><a href="/AddCamps">Add Camps</a></li>
                <li><a href="/ExistingCamps">Existing Camps</a></li>
                <li><a href="#">Earnings</a></li>
                {/* Call handleLogout function on click */}
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
            </ul>
        </div>
    );
}

export default Sidebar;
