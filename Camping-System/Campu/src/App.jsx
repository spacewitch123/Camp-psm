import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../src/Layout';
import Footer from "../src/components/Footer";
import Home from "../src/components/Home";
import About from "../src/components/About";
import Camper from "../src/components/Camper";
import CustomerLogin from "../src/components/CustomerLogin";
import CampownerSignup from "../src/components/CampownerSignup";
import CampOwnerLogin from "../src/components/CampownerLogin";
import CampOwnerHome from "../src/pages/CampOwner";
import AddCamps from '../src/components/AddCamps';
import ExistingCamps from '../src/components/ExistingCamps';
import UpdateDelete from '../src/components/UpdateDelete';
import Profile from '../src/components/Profile';
import CamperHomePage from '../src/pages/CamperHomePage';
import Payment from '../src/components/Payment';
import CampDetails from '../src/components/CampDetails';
import CampsFound from '../src/components/CampsFound';
import Confirmation from '../src/components/Confirmation';
import Reservation from '../src/components/Reservation';
import ConfirmationDetails from '../src/components/ConfirmationDetails';
import CustomerProfile from '../src/components/CustomerProfile';
import MyHistory from '../src/components/MyHistory';
import Earnings from '../src/components/Earnings';
import Review from '../src/components/Review';
import CitySection from '../src/components/CitySection';
import AdminLogin from '../src/components/AdminLogin';
import AdminDashboard from '../src/components/AdminDashboard';
import Customers from '../src/components/Customers';  // Add this import
import Campowners from '../src/components/Campowners';
import AdminCamps from '../src/components/AdminCamps';
import ApproveCampowners from '../src/components/ApproveCampowners';
import ForgotPassword from '../src/components/ForgotPassword';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51NJLNTK91cI0cPL1facBXDKKExgZgW3dapUOjiPSsWGbD8XnEhj2Tst8CbwNoaC19Tgm9xcCpNNg1M2pe1WSpXM500l8MBmzOx');

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="camper" element={<Camper />} />
              <Route path="CustomerLogin" element={<CustomerLogin />} />
              <Route path="CampownerSignup" element={<CampownerSignup />} />
              <Route path="CampownerLogin" element={<CampOwnerLogin />} />
              <Route path="CampOwner" element={<CampOwnerHome />} />
              <Route path="AddCamps" element={<AddCamps />} />
              <Route path="ExistingCamps" element={<ExistingCamps />} />
              <Route path="updateDelete/:id" element={<UpdateDelete />} />
              <Route path="profile" element={<Profile />} />
              <Route path="CamperHomePage" element={<CamperHomePage />} />
              <Route path="Reservation" element={<Reservation />} />
              <Route path="Payment" element={<Payment />} />
              <Route path="CampsFound" element={<CampsFound />} />
              <Route path="Confirmation" element={<Confirmation />} />
              <Route path="/campdetails/:campId" element={<CampDetails />} />
              <Route path='ConfirmationDetails' element={<ConfirmationDetails />} />
              <Route path="/Earnings" element={<Earnings />} />
              <Route path="/CustomerProfile" element={<CustomerProfile />} />
              <Route path="/MyHistory" element={<MyHistory />} />
              <Route path="/review" element={<Review />} />
              <Route path="/citysection" element={<CitySection />} />
              <Route path="/AdminLogin" element={<AdminLogin />} /> {/* Add this route */}
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/customer" element={<Customers />} />  // Add this route
              <Route path="/campowners" element={<Campowners />} />
              <Route path="/admincamps" element={<AdminCamps />} />
              <Route path="/approve-campowners" element={<ApproveCampowners />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </Elements>
    </div>
  );
}

export default App;
