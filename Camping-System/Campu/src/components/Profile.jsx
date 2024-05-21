import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Create a CSS file for styling
import Sidebar from './Sidebar';

function Profile() {
    const [profileData, setProfileData] = useState("");
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(""); // Add state to track update success/error
    const [error, setError] = useState("");
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/profile', { withCredentials: true })
            .then(response => {
                setProfileData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                setError('Error fetching profile data');
                setIsLoading(false);
            });
    }, []);

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        axios.post('http://localhost:3001/Changepassword', { currentPassword, newPassword }, { withCredentials: true })
            .then(response => {
                setNewPassword('');
                setConfirmPassword('');
                setUpdateSuccess('Password changed successfully');
                setError(null);
            })
            .catch(error => {
                console.error('Error changing password:', error);
                setError('Error changing password');
            });
    };

    const handleProfilePictureChange = (event) => {
        setProfilePicture(event.target.files[0]);
    };

    const handleProfilePictureUpload = () => {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        axios.post('http://localhost:3001/Profilepicture', formData, { withCredentials: true })
            .then(response => {
                axios.get('/profile', { withCredentials: true })
                    .then(response => setProfileData(response.data))
                    .catch(error => console.error('Error fetching profile data:', error));

                setUpdateSuccess('Profile picture updated successfully');
                setError(null);
            })
            .catch(error => {
                console.error('Error uploading profile picture:', error);
                setError('Error uploading profile picture');
            });
    };

    const handleProfilePictureRemove = () => {
        axios.delete('http://localhost:3001/removeProfilePicture', { withCredentials: true })
            .then(response => {
                setProfileData(prevState => ({ ...prevState, profilePicture: null }));
                setUpdateSuccess('Profile picture removed successfully');
                setError(null);
            })
            .catch(error => {
                console.error('Error removing profile picture:', error);
                setError('Error removing profile picture');
            });
    };

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <div className="profile-container">
                    <h2>My Profile</h2>

                    <div className="profile-picture">
                        {profileData.profilePicture ? (
                            <>
                                <img src={`http://localhost:3001/profile_pictures/${profileData.profilePicture}`} alt="Profile" />
                                <button onClick={handleProfilePictureRemove}>Remove</button>
                            </>
                        ) : (
                            <>
                                <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                                <button onClick={handleProfilePictureUpload}>Upload</button>
                            </>
                        )}
                    </div>

                    <div className="profile-info">
                        <p><strong>Full Name:</strong> {profileData.fullName}</p>
                        <p><strong>Email:</strong> {profileData.email}</p>
                        <p><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
                    </div>

                    <div className="password-change">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handlePasswordChange}>Change Password</button>
                    </div>

                    {updateSuccess && <div className="success-message">{updateSuccess}</div>}
                </div>
            </div>
        </div>
    );
}

export default Profile;
