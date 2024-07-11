import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import AdminNav from './AdminNav';
import 'chart.js/auto';

function AdminDashboard() {
    const [data, setData] = useState({ totalCamps: 0, totalReservations: 0 });
    const [weeklyEarnings, setWeeklyEarnings] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/admindashboarddata', {
                    withCredentials: true, // Include cookies in the request
                });
                setData(response.data);

                const earningsResponse = await axios.get('http://localhost:3001/weeklyearnings', {
                    withCredentials: true, // Include cookies in the request
                });
                setWeeklyEarnings(earningsResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                navigate('/adminlogin'); // Redirect to login if not authenticated
            }
        };

        fetchData();
    }, [navigate]);

    const chartData = {
        labels: ['Camps', 'Reservations'],
        datasets: [
            {
                label: 'Count',
                data: [data.totalCamps, data.totalReservations],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const earningsChartData = {
        labels: Object.keys(weeklyEarnings),
        datasets: [
            {
                label: 'Weekly Earnings (RM)',
                data: Object.values(weeklyEarnings),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <AdminNav />
            <div className="container mx-auto mt-24 p-4">
                <h1 className="text-4xl font-bold mb-6"></h1>
                <div className="flex flex-wrap justify-center space-x-4">
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-8">
                        <div style={{ width: '100%', height: '300px' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-8">
                        <h2 className="text-2xl font-bold mb-4">Weekly Earnings</h2>
                        <div style={{ width: '100%', height: '300px' }}>
                            <Line data={earningsChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
