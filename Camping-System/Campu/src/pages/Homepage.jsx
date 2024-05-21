import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import UpdateDelete from '../components/updateDelete';
import Profile from '../components/Profile';

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage authentication status

    return (
        <div>
            <Router>
                {/* Render the Navbar regardless of authentication status */}
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/camper" element={<Camper />} />
                    <Route path="/CustomerLogin" element={<CustomerLogin />} />
                    <Route path="/CampownerSignup" element={<CampownerSignup />} />
                    <Route path="/CampownerLogin" element={<CampOwnerLogin />} />
                    <Route path="/CampOwner" element={<CampOwnerHome />} />
                    <Route path="/AddCamps" element={<AddCamps />} />
                    <Route path="/ExistingCamps" element={<ExistingCamps />} />
                    <Route path="/updateDelete/:id" element={<UpdateDelete />} />
                    <Route path='/profile' element={<Profile />} />

                </Routes>
                <Footer />
            </Router>
        </div>
    );
}

export default HomePage;
