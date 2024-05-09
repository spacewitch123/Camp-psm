import React from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import './Sidebar.css'; // Import your CSS file for styling

function Sidebar() {
    axios.defaults.withCredentials = true;
    // Function to handle logout
    const handleLogout = async () => {
        try {
            // Send a POST request to the logout endpoint
            await axios.post('/logout');
            // Clear the token from the browser's cookies
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            // Redirect to the home page
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle logout failure
        }
    };

    return (
        <div className="sidebar">
            <h2>Camp Owner Dashboard</h2>
            <ul>
                <li><a href="#">Profile</a></li>
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
