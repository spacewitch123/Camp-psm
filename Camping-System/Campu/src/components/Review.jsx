import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerNav from './CustomerNav';

export default function Review() {
    const location = useLocation();
    const { campId, campName } = location.state || {};
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/reviews', {
                campId,
                rating,
                review
            });
            setMessage('Review submitted successfully');
            setError('');
            setTimeout(() => navigate('/myhistory'), 2000); // Redirect back to My History after 2 seconds
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Error submitting review');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <CustomerNav />
            <div className="flex-grow flex justify-center items-center mt-16">
                <div className="bg-white shadow-md rounded p-6 max-w-lg mx-auto mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">Leave a Review for {campName}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full"
                            >
                                <option value={0}>Select a rating</option>
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <option key={r} value={r}>
                                        {r} Star{r > 1 && 's'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Review</label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full"
                                rows="4"
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">
                            Submit Review
                        </button>
                    </form>
                    {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
                    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}
