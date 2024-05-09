import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import Home from "../components/Home";
import About from "../components/About";
import Camper from "../components/Camper";
import CustomerLogin from "../components/CustomerLogin";
import CampownerSignup from "../components/CampownerSignup";
import CampOwnerLogin from "../components/CampownerLogin";
import CampOwnerHome from "./CampOwner";
import AddCamps from '../components/AddCamps';
import ExistingCamps from '../components/ExistingCamps';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/camper',
        element: <Camper />
    },
    {
        path: '/CustomerLogin',
        element: <CustomerLogin />
    },
    {
        path: '/CampownerSignup',
        element: <CampownerSignup />
    },
    {
        path: '/CampownerLogin',
        element: <CampOwnerLogin />
    },
    {
        path: '/CampOwner',
        element: <CampOwnerHome />
    },
    {
        path: '/AddCamps',
        element: <AddCamps />
    },
    {
        path: '/ExistingCamps',
        element: <ExistingCamps />
    },

])
function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage authentication status

    return (
        <div>
            {/* {isLoggedIn ? <Navbar /> : null}
            Conditionally render the Navbar */}
            <Navbar />
            <RouterProvider router={router} />
            <Footer />
        </div>
    );
}

export default HomePage;
