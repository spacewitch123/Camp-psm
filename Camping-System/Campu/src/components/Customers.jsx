import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';

function Customers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/customers', {
                    withCredentials: true,
                });
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const deleteCustomer = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/customers/${id}`, {
                withCredentials: true,
            });
            setCustomers(customers.filter(customer => customer._id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
            <AdminNav />
            <h2 className="text-3xl font-bold mb-6">Customers</h2>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Email</th>
                            <th className="py-3 px-6 bg-gray-800 text-white text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer._id} className="border-b border-gray-200">
                                <td className="py-4 px-6 text-sm">{customer.username}</td>
                                <td className="py-4 px-6 text-sm">{customer.email}</td>
                                <td className="py-4 px-6 text-sm">
                                    <button
                                        onClick={() => deleteCustomer(customer._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Customers;