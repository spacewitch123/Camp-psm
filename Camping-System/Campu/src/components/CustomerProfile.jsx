import React, { useState, useEffect } from 'react';
import CustomerNav from '@/components/CustomerNav';
import axios from 'axios';

function CustomerProfile() {
    const [profileData, setProfileData] = useState({
        profilePicture: '',
        username: '',
        email: '',
    });
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the profile data from the server
        axios.get('http://localhost:3001/customerprofile')
            .then(response => {
                setProfileData(response.data);
                setNewUsername(response.data.username);
                setNewEmail(response.data.email);
            })
            .catch(error => console.error('Error fetching profile data:', error));
    }, []);

    const handleProfilePictureChange = (event) => {
        setNewProfilePicture(event.target.files[0]);
    };

    const handleProfilePictureUpload = () => {
        const formData = new FormData();
        formData.append('profilePicture', newProfilePicture);

        axios.post('http://localhost:3001/customer-profile-picture', formData)
            .then(response => {
                setProfileData(prevState => ({ ...prevState, profilePicture: response.data.profilePicture }));
                setMessage('Profile picture updated successfully');
                setError('');
            })
            .catch(error => {
                console.error('Error uploading profile picture:', error);
                setError('Error uploading profile picture');
            });
    };

    const handleRemoveProfilePicture = () => {
        axios.delete('http://localhost:3001/customer-remove-profile-picture')
            .then(response => {
                setProfileData(prevState => ({ ...prevState, profilePicture: '' }));
                setMessage('Profile picture removed successfully');
                setError('');
            })
            .catch(error => {
                console.error('Error removing profile picture:', error);
                setError('Error removing profile picture');
            });
    };

    const handleUsernameChange = async () => {
        try {
            const response = await axios.post('http://localhost:3001/check-username', { username: newUsername });
            if (response.status === 200) {
                // Proceed to update username
                axios.post('http://localhost:3001/customer-update-username', { username: newUsername })
                    .then(response => {
                        setProfileData(prevState => ({ ...prevState, username: newUsername }));
                        setMessage('Username updated successfully');
                        setError('');
                    })
                    .catch(error => {
                        console.error('Error updating username:', error);
                        setError('Error updating username');
                    });
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Username already exists, please choose another one');
            } else {
                setError('Error checking username availability');
            }
        }
    };

    const handleEmailChange = () => {
        axios.post('http://localhost:3001/customer-update-email', { email: newEmail })
            .then(response => {
                setProfileData(prevState => ({ ...prevState, email: newEmail }));
                setMessage('Email updated successfully');
                setError('');
            })
            .catch(error => {
                console.error('Error updating email:', error);
                setError('Error updating email');
            });
    };

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        axios.post('http://localhost:3001/customer-change-password', { currentPassword, newPassword })
            .then(response => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setMessage('Password updated successfully');
                setError('');
            })
            .catch(error => {
                console.error('Error updating password:', error);
                setError('Error updating password');
            });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <CustomerNav />
            <div className="flex-grow flex justify-center items-center mt-16">
                <div className="bg-white shadow-md rounded p-6 max-w-lg mx-auto mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">Customer Profile</h2>

                    <div className="mb-4 text-center">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
                        {profileData.profilePicture && (
                            <div className="mb-2">
                                <img src={`http://localhost:3001/images/${profileData.profilePicture}`} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-2" />
                                <button onClick={handleRemoveProfilePicture} className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-red-700">Remove</button>
                            </div>
                        )}
                        <input type="file" onChange={handleProfilePictureChange} />
                        <button onClick={handleProfilePictureUpload} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700">Upload</button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                        <button onClick={handleUsernameChange} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 w-full">Change Username</button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                        <button onClick={handleEmailChange} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 w-full">Change Email</button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </div>

                    <button onClick={handlePasswordChange} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 w-full">Change Password</button>

                    {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
                    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default CustomerProfile;
