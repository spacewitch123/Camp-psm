import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import Home from "../components/Home";
import About from "../components/About";
import Camper from "../components/Camper";


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
