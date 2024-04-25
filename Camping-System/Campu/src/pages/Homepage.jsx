import React from "react";
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
    }
])
function HomePage() {
    return (
        <div>
            <Navbar />
            <RouterProvider router={router} />
            <Footer />
        </div>

    );
}

export default HomePage;
