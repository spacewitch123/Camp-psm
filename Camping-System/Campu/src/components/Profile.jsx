import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">My Profile</h2>
                    <div className="mb-4">
                        <div className="flex flex-col items-center">
                            {profileData.profilePicture ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`http://localhost:3001/images/${profileData.profilePicture}`}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover mb-4"
                                    />
                                    <button
                                        onClick={handleProfilePictureRemove}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="mb-4"
                                    />
                                    <button
                                        onClick={handleProfilePictureUpload}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Upload
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg"><strong>Full Name:</strong> {profileData.fullName}</p>
                        <p className="text-lg"><strong>Email:</strong> {profileData.email}</p>
                        <p className="text-lg"><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">Change Password</h3>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                        <button
                            onClick={handlePasswordChange}
                            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Change Password
                        </button>
                    </div>
                    {updateSuccess && <div className="text-green-500">{updateSuccess}</div>}
                </div>
            </div>
        </div>
    );
}

export default Profile;
