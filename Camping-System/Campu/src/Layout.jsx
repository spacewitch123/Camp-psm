import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from "../src/components/navbar";

function Layout() {
    const location = useLocation();

    // Array of paths where the Navbar should not be shown
    const noNavbarPaths = ['/CamperHomePage', '/payment', '/ConfirmationDetails', '/reservation', '/campsfound', '/confirmation', '/campdetails/id:', '/updateDelete/id:', '/Earnings', '/Profile', '/AddCamps', '/ExistingCamps', '/CustomerProfile', '/MyHistory', '/review', '/myhistory', '/admindashboard', '/campowners', '/customer', '/AdminCamps', '/approve-campowners', '/CampOwner', '/profile', '/earnings', '/addcamps'];

    // Function to determine if the current path is in the noNavbarPaths array
    const shouldHideNavbar = noNavbarPaths.includes(location.pathname);

    console.log("Current Path:", location.pathname); // Debug log

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <Outlet />  {/* Use Outlet as a component */}
        </>
    );
}

export default Layout;
