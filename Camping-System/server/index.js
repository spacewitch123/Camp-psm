import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import SignupModel from './models/campUser.js';
import CampownerSignupModel from './models/CampOwner.js';
import NewCampModel from './models/Camp.js';
import Reservation from './models/reservation.js';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import axios from "axios";
import Admin from './models/Admin.js';
import { REACT_APP_GOOGLE_MAPS_KEY } from './constants.js';
import fs from 'fs';
import Stripe from 'stripe';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeAdmin = async () => {
    const adminUsername = 'admin';
    const adminPassword = 'admin123';

    try {
        const existingAdmin = await Admin.findOne({ username: adminUsername });
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = new Admin({
            username: adminUsername,
            password: hashedPassword,
        });

        await newAdmin.save();
        console.log('Admin created successfully');
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};

// Call the function to initialize the admin user
initializeAdmin();


const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/api/geocode/json', (req, res) => {
    const { latitude, longitude } = req.query;

    // Construct the Google Maps API URL
    const googleMapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${REACT_APP_GOOGLE_MAPS_KEY}`;

    axios
        .get(googleMapsApiUrl) // Fetch from Google Maps API
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error("Error fetching address:", error);
            res.status(500).json({ error: 'Error fetching address' });
        });
});


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const stripe = new Stripe('sk_test_51NJLNTK91cI0cPL1Bnusmdx6uyQkCd3LI1aMEvgGWo1kb6vyCyilhFpxxX4DsH7xpxsN3nRMWSkWn6tPPOGwF3fq00K9s76Lul');
mongoose.connect("mongodb://127.0.0.1:27017/Camper");

// Global variable to store invalidated tokens
const tokenBlacklist = new Set();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});



const upload = multer({
    storage: storage
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if token exists in the blacklist
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ error: 'Token invalid' });
    }

    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.userId = decoded.id;
        next();
    });
};



const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.adminId = decoded.id;
        next();
    });
};


const certificateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/certificates');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const certificateUpload = multer({ storage: certificateStorage });

const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
};



app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;

    SignupModel.findOne({ $or: [{ username: username }, { email: email }] })
        .then(existingUser => {
            if (existingUser) {
                if (existingUser.username === username) {
                    return res.status(400).json({ message: "Username already exists" });
                } else if (existingUser.email === email) {
                    return res.status(400).json({ message: "Email already exists" });
                }
            } else {
                bcrypt.hash(password, 10)
                    .then(hash => {
                        SignupModel.create({ username, email, password: hash })
                            .then(user => res.json(user))
                            .catch(err => res.status(500).json({ error: err.message }));
                    })
                    .catch(err => res.status(500).json({ error: err.message }));
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await SignupModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, "jwt-secret-key", { expiresIn: "1d" });

        res.cookie("token", token, { httpOnly: true });
        res.json({ message: "Login successful", redirect: "/CamperHomePage" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/signupowner", certificateUpload.single('certificate'), async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;
    const certificate = req.file.filename;

    try {
        const existingOwner = await CampownerSignupModel.findOne({ email: email });
        if (existingOwner) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = new CampownerSignupModel({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            certificate,
            isApproved: false
        });

        await newOwner.save();
        res.json({ message: 'Signup successful, pending approval' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/loginowner", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await CampownerSignupModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!user.isApproved) {
            return res.status(403).json({ error: "Account pending approval" });
        }

        const result = bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, "jwt-secret-key", { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: 'Lax' });
        res.json({ message: "Login successful", ownerId: user._id, redirect: "/CampOwner" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


app.post('/adminlogin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username: username });
        if (admin) {
            const result = await bcrypt.compare(password, admin.password);
            if (result === true) {
                const token = jwt.sign({ id: admin._id }, "jwt-secret-key", { expiresIn: "1d" });

                res.cookie("token", token, { httpOnly: true, secure: false, sameSite: 'Lax' });

                res.json({ message: "Login successful", adminId: admin._id, redirect: "/admindashboard" });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/earnings/owner', async (req, res) => {
    try {
        const { ownerId } = req.query;
        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID is required' });
        }

        // Fetch camps owned by the owner
        const camps = await NewCampModel.find({ owner: ownerId });

        const earningsByWeek = [];
        for (const camp of camps) {
            const reservations = await Reservation.find({ camp: camp._id });

            const earningsByCampWeek = reservations.reduce((acc, reservation) => {
                const weekRange = getWeekRange(reservation.formData.checkInDate);
                const weekKey = `${weekRange.startOfWeek.toISOString()}-${weekRange.endOfWeek.toISOString()}`;

                if (!acc[weekKey]) {
                    acc[weekKey] = {
                        campId: camp._id,
                        campName: camp.campName,
                        earnings: 0,
                        reservations: [],
                    };
                }

                acc[weekKey].earnings += reservation.totalPrice;
                acc[weekKey].reservations.push(reservation);

                return acc;
            }, {});

            earningsByWeek.push(...Object.values(earningsByCampWeek));
        }

        res.json(earningsByWeek);
    } catch (error) {
        console.error('Error fetching earnings:', error);
        res.status(500).json({ message: 'Error fetching earnings', error: error.message });
    }
});

app.get("/logout", (req, res) => {
    const token = req.cookies.token;
    if (token) {
        // Remove the token from the cookies object
        res.cookie('token', '', { maxAge: 0, httpOnly: true });
        res.json({ message: 'Logout successful' });
    } else {
        res.status(400).json({ error: 'No token found' });
    }
});


app.post("/NewCamp", verifyToken, upload.array('images', 10), async (req, res) => {
    const {
        campName,
        city,
        capacity,
        price,
        latitude,
        longitude,
        campType,          // New fields from the form
        numberOfUnits,
        description,
        phoneNumber,
        socialMedia,
        amenities: amenitiesString // Get amenities as a string
    } = req.body;

    // Check if req.files exists and if it contains an 'images' property
    if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No images uploaded" });
    }

    try {
        const images = req.files.map(file => file.filename);

        // Construct URLs for the images
        const imageUrls = images.map(filename => `/images/${filename}`);

        // Parse the amenities string into an array (if it's not empty)
        const amenities = amenitiesString ? JSON.parse(amenitiesString) : [];

        // Create a new camp with the image URLs and new fields
        const newCamp = await NewCampModel.create({
            campName,
            city,
            capacity,
            price,
            latitude,
            longitude,
            images: imageUrls,
            owner: req.userId,
            campType,        // Save the new fields
            numberOfUnits,
            description,
            phoneNumber,
            socialMedia,
            amenities
        });

        // Update the camp owner's document to include the ID of the newly created camp
        await CampownerSignupModel.findByIdAndUpdate(req.userId, { $push: { camps: newCamp._id } });

        res.json(newCamp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get("/ExistingCamps", verifyToken, async (req, res) => {
    try {
        const campOwnerId = req.userId; // Assuming req.userId holds the camp owner's ID
        const existingCamps = await NewCampModel.find({ owner: campOwnerId }).populate('owner');
        res.json(existingCamps);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get a single camp by ID
app.get("/camps/:id", verifyToken, async (req, res) => {
    try {
        const camp = await NewCampModel.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ error: "Camp not found" });
        }
        res.json(camp);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Update a camp by ID
app.put("/camps/:id", verifyToken, async (req, res) => {
    try {
        const updatedCamp = await NewCampModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCamp) {
            return res.status(404).json({ error: "Camp not found" });
        }
        res.json(updatedCamp);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a camp by ID
app.delete("/camps/:id", verifyToken, async (req, res) => {
    try {
        const deletedCamp = await NewCampModel.findByIdAndDelete(req.params.id);
        if (!deletedCamp) {
            return res.status(404).json({ error: "Camp not found" });
        }
        res.json({ message: "Camp deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const profilePictureUpload = multer({ storage: profilePictureStorage });

app.get('/camps', async (req, res) => {
    const { city } = req.query;
    try {
        const camps = await NewCampModel.find({ city });
        res.json(camps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/profile', verifyToken, async (req, res) => {
    try {
        const campowner = await CampownerSignupModel.findById(req.userId);
        if (!campowner) {
            return res.status(404).json({ error: 'Camp owner not found' });
        }
        res.json({
            fullName: campowner.fullName,
            email: campowner.email,
            phoneNumber: campowner.phoneNumber,
            profilePicture: campowner.profilePicture
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/Profilepicture', verifyToken, profilePictureUpload.single('profilePicture'), async (req, res) => {
    try {
        const campowner = await CampownerSignupModel.findById(req.userId);
        if (!campowner) {
            return res.status(404).json({ error: 'Camp owner not found' });
        }

        if (campowner.profilePicture) {
            fs.unlinkSync('public/images/' + campowner.profilePicture);
        }

        campowner.profilePicture = req.file.filename;
        await campowner.save();
        res.json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/Changepassword', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const campowner = await CampownerSignupModel.findById(req.userId);
        if (!campowner) {
            return res.status(404).json({ error: 'Camp owner not found' });
        }

        const isMatch = bcrypt.compare(currentPassword, campowner.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        campowner.password = hashedPassword;
        await campowner.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/removeProfilePicture', verifyToken, async (req, res) => {
    try {
        const campowner = await CampownerSignupModel.findById(req.userId);
        if (!campowner) {
            return res.status(404).json({ error: 'Camp owner not found' });
        }

        if (campowner.profilePicture) {
            const profilePicturePath = path.join(__dirname, 'public/images', campowner.profilePicture);
            fs.unlink(profilePicturePath, (err) => {
                if (err) {
                    console.error('Error removing profile picture:', err);
                    return res.status(500).json({ error: 'Error removing profile picture' });
                }
                campowner.profilePicture = null;
                campowner.save()
                    .then(() => res.json({ message: 'Profile picture removed successfully' }))
                    .catch(error => res.status(500).json({ error: 'Error saving profile changes' }));
            });
        } else {
            res.status(400).json({ error: 'No profile picture to remove' });
        }
    } catch (error) {
        console.error('Error removing profile picture:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post("/resultgetcamps", async (req, res) => {
    try {
        const { checkInDate, checkOutDate, location, numPeople } = req.body;

        // Perform geocoding to get the city from the location coordinates
        const geocodeResponse = await axios.get(`http://localhost:3001/api/geocode/json?latitude=${location.lat}&longitude=${location.lng}`);
        if (geocodeResponse.data.status !== 'OK') {
            throw new Error('Geocoding failed');
        }

        // Extract city name from geocoding response
        let city;
        const results = geocodeResponse.data.results;
        if (results && results.length > 0) {
            const addressComponents = results[0].address_components;
            const cityComponent = addressComponents.find(component => component.types.includes('locality'));
            if (cityComponent) {
                city = cityComponent.long_name;
            }
        }

        // Query camps from the database based on the provided parameters
        const existingCampLocations = await NewCampModel.find();

        // Filter camps based on proximity
        const camps = existingCampLocations.filter(existingCamp => {
            if (existingCamp.latitude == null || existingCamp.longitude == null) {
                return false; // Skip camps without valid coordinates
            }

            const dLat = (existingCamp.latitude - location.lat) * Math.PI / 180;
            const dLon = (existingCamp.longitude - location.lng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(location.lat * Math.PI / 180) * Math.cos(existingCamp.latitude * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = 6371 * c; // Radius of the earth in km

            return distance <= 10; // Filter camps within 10 km radius
        });

        // Filter camps based on availability
        const availableCamps = [];
        for (const camp of camps) {
            const reservations = await Reservation.find({
                camp: camp._id,
                $or: [
                    {
                        "formData.checkInDate": { $lte: checkOutDate },
                        "formData.checkOutDate": { $gte: checkInDate }
                    }
                ]
            });

            const reservedUnits = reservations.reduce((total, reservation) => total + reservation.formData.units, 0);
            const availableUnits = camp.numberOfUnits - reservedUnits;

            if (availableUnits >= numPeople) {
                availableCamps.push(camp);
            }
        }

        // Send the response with the retrieved camps and the city
        res.json({ success: true, camps: availableCamps, city });
    } catch (error) {
        // Handle errors and send an appropriate response
        console.error('Error fetching camps:', error);
        res.status(500).json({ success: false, message: 'Error fetching camps' });
    }
});

app.post("/getcamps", async (req, res) => {
    try {
        const { checkInDate, checkOutDate, location, numPeople } = req.body;

        // Perform geocoding to get the city from the location coordinates
        const geocodeResponse = await
            axios.get(`http://localhost:3001/api/geocode/json?latitude=${location.lat}&longitude=${location.lng}`);
        if (geocodeResponse.data.status !== 'OK') {
            throw new Error('Geocoding failed');
        }

        // Extract city name from geocoding response
        let city;
        const results = geocodeResponse.data.results;
        if (results && results.length > 0) {
            console.log('Geocoding results:', results);
            const addressComponents = results[0].address_components;
            console.log('Address components:', addressComponents);
            const cityComponent = addressComponents.find(component => component.types.includes('locality'));
            if (cityComponent) {
                city = cityComponent.long_name;
            }
        }

        // Query camps from the database based on the provided parameters
        const existingCampLocations = await NewCampModel.find();
        console.log('Existing camp locations:', existingCampLocations);
        // Filter camps based on proximity
        const camps = existingCampLocations.filter(existingCamp => {
            if (existingCamp.latitude == null || existingCamp.longitude == null) {
                return false; // Skip camps without valid coordinates
            }

            const dLat = (existingCamp.latitude - location.lat) * Math.PI / 180;
            const dLon = (existingCamp.longitude - location.lng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(location.lat * Math.PI / 180) * Math.cos(existingCamp.latitude * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = 6371 * c; // Radius of the earth in km

            console.log(`Checking camp: ${existingCamp.campName}, Distance: ${distance} km`);

            return distance <= 10; // Filter camps within 10 km radius
        });

        // Log filtered camps
        console.log('Filtered camps:', camps);

        // Send the response with the retrieved camps and the city
        res.json({ success: true, camps, city });
    } catch (error) {
        // Handle errors and send an appropriate response
        console.error('Error fetching camps:', error);
        res.status(500).json({ success: false, message: 'Error fetching camps' });
    }
});
app.post('/payment', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'myr', // Malaysian Ringgit
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/reservations', verifyToken, async (req, res) => {
    try {
        const { campId, formData, totalPrice, paymentStatus, paymentIntent } = req.body;

        // Check if a reservation already exists with the same camp, user, and check-in date
        const existingReservation = await Reservation.findOne({
            camp: campId,
            user: req.userId,
            'formData.checkInDate': formData.checkInDate,
            'formData.checkOutDate': formData.checkOutDate
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'Reservation already exists for this camp and check-in date.' });
        }

        const newReservation = new Reservation({
            camp: campId,
            user: req.userId, // Set the user field from the token
            formData,
            totalPrice,
            paymentStatus,
            paymentIntent,
        });

        await newReservation.save();
        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        console.error('Error saving reservation:', error);
        res.status(500).json({ message: 'Error saving reservation', error: error.message });
    }
});


app.delete('/reservations/:id', verifyToken, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to cancel this reservation' });
        }

        await Reservation.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
    }
});

app.get('/earnings/owner', async (req, res) => {
    try {
        const ownerId = req.query.ownerId; // Get ownerId from query params
        console.log('Received ownerId:', ownerId); // Debugging line
        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID is required' });
        }

        const camps = await NewCampModel.find({ owner: ownerId });
        if (!camps.length) {
            return res.status(404).json({ message: 'No camps found for this owner' });
        }

        const campIds = camps.map(camp => camp._id);

        const reservations = await Reservation.find({ camp: { $in: campIds } });

        const earnings = reservations.reduce((acc, reservation) => {
            const camp = camps.find(c => c._id.equals(reservation.camp));
            if (camp) {
                acc.push({
                    campId: camp._id,
                    campName: camp.campName,
                    earnings: reservation.totalPrice
                });
            }
            return acc;
        }, []);

        res.json(earnings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/customerprofile', verifyToken, async (req, res) => {
    try {
        const customer = await SignupModel.findById(req.userId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({
            username: customer.username,
            email: customer.email,
            profilePicture: customer.profilePicture
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/check-username', async (req, res) => {
    const { username } = req.body;
    const user = await SignupModel.findOne({ username });
    if (user) {
        return res.status(409).json({ message: 'Username already exists' });
    }
    res.status(200).json({ message: 'Username is available' });
});

// Update profile picture
app.post('/customer-profile-picture', verifyToken, profilePictureUpload.single('profilePicture'), async (req, res) => {
    try {
        const customer = await SignupModel.findById(req.userId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        if (customer.profilePicture) {
            fs.unlinkSync('public/images/' + customer.profilePicture);
        }

        customer.profilePicture = req.file.filename;
        await customer.save();
        res.json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change password
app.post('/customer-change-password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const customer = await SignupModel.findById(req.userId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, customer.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        customer.password = hashedPassword;
        await customer.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove profile picture
app.delete('/customer-remove-profile-picture', verifyToken, async (req, res) => {
    try {
        const customer = await SignupModel.findById(req.userId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        if (customer.profilePicture) {
            const profilePicturePath = path.join(__dirname, 'public/images', customer.profilePicture);
            fs.unlink(profilePicturePath, (err) => {
                if (err) {
                    console.error('Error removing profile picture:', err);
                    return res.status(500).json({ error: 'Error removing profile picture' });
                }
                customer.profilePicture = null;
                customer.save()
                    .then(() => res.json({ message: 'Profile picture removed successfully' }))
                    .catch(error => res.status(500).json({ error: 'Error saving profile changes' }));
            });
        } else {
            res.status(400).json({ error: 'No profile picture to remove' });
        }
    } catch (error) {
        console.error('Error removing profile picture:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/customer-update-username', verifyToken, async (req, res) => {
    const { username } = req.body;

    try {
        const existingUser = await SignupModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const customer = await SignupModel.findById(req.userId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer.username = username;
        await customer.save();

        res.json({ message: 'Username updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/customer-update-email', verifyToken, async (req, res) => {
    const { email } = req.body;

    try {
        const existingEmail = await SignupModel.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const customer = await SignupModel.findById(req.userId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer.email = email;
        await customer.save();

        res.json({ message: 'Email updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/myreservations', verifyToken, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.userId })
            .populate('camp');
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/reviews', verifyToken, async (req, res) => {
    const { campId, rating, review } = req.body;

    try {
        const camp = await NewCampModel.findById(campId);
        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        const newReview = {
            user: req.userId,
            rating,
            review,
            createdAt: new Date()
        };

        camp.reviews.push(newReview);
        await camp.save();
        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
});

app.get('/camps/:campId/reviews', async (req, res) => {
    try {
        const camp = await NewCampModel.findById(req.params.campId)
            .populate('reviews.user', 'username'); // Populate the user field with the username
        if (!camp) {
            return res.status(404).json({ error: 'Camp not found' });
        }
        res.json({ reviews: camp.reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/camps/:id', async (req, res) => {
    try {
        const camp = await NewCampModel.findById(req.params.id).populate('reviews.user');
        res.json(camp);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching camp details', error: error.message });
    }
});

// Endpoint to get admin dashboard data
app.get('/admindashboarddata', verifyAdminToken, async (req, res) => {
    try {
        const totalCamps = await NewCampModel.countDocuments();
        const totalReservations = await Reservation.countDocuments();

        res.json({ totalCamps, totalReservations });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
});

app.get('/weeklyearnings', verifyAdminToken, async (req, res) => {
    try {
        const reservations = await Reservation.find();

        const earningsByWeek = {};

        reservations.forEach(reservation => {
            const week = new Date(reservation.formData.checkInDate).getWeek(); // Assuming `getWeek()` is a utility function to get the week number
            if (!earningsByWeek[week]) {
                earningsByWeek[week] = 0;
            }
            earningsByWeek[week] += reservation.totalPrice;
        });

        res.json(earningsByWeek);
    } catch (error) {
        console.error('Error fetching weekly earnings:', error);
        res.status(500).json({ message: 'Error fetching weekly earnings', error: error.message });
    }
});

// Utility function to get the week number
Date.prototype.getWeek = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Fetch all customers
app.get('/customers', verifyAdminToken, async (req, res) => {
    try {
        const customers = await SignupModel.find();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Error fetching customers' });
    }
});

// Delete a customer by ID
app.delete('/customers/:id', verifyAdminToken, async (req, res) => {
    try {
        const customer = await SignupModel.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Error deleting customer' });
    }
});

// Fetch all camp owners
app.get('/campowners', verifyAdminToken, async (req, res) => {
    try {
        const campowners = await CampownerSignupModel.find();
        res.json(campowners);
    } catch (error) {
        console.error('Error fetching camp owners:', error);
        res.status(500).json({ message: 'Error fetching camp owners' });
    }
});

// Delete a camp owner by ID
app.delete('/campowners/:id', verifyAdminToken, async (req, res) => {
    try {
        const campowner = await CampownerSignupModel.findByIdAndDelete(req.params.id);
        if (!campowner) {
            return res.status(404).json({ message: 'Camp owner not found' });
        }
        res.json({ message: 'Camp owner deleted successfully' });
    } catch (error) {
        console.error('Error deleting camp owner:', error);
        res.status(500).json({ message: 'Error deleting camp owner' });
    }
});

app.get('/admincamps', async (req, res) => {
    try {
        const camps = await NewCampModel.find();
        res.json(camps);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching camps', error: error.message });
    }
});

app.get('/campowners/pending', verifyAdminToken, async (req, res) => {
    try {
        const pendingCampowners = await CampownerSignupModel.find({ isApproved: false });
        res.json(pendingCampowners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending camp owners', error: error.message });
    }
});

app.post('/campowners/approve/:id', verifyAdminToken, async (req, res) => {
    try {
        const campowner = await CampownerSignupModel.findByIdAndUpdate(req.params.id, { isApproved: true });
        if (!campowner) {
            return res.status(404).json({ message: 'Camp owner not found' });
        }
        res.json({ message: 'Camp owner approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error approving camp owner', error: error.message });
    }
});

app.get('/certificates/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'public/certificates', filename);
    res.sendFile(filePath);
});

app.get('/checkAuth', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isAuthenticated: false });
    }

    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.json({ isAuthenticated: false });
        }
        res.json({ isAuthenticated: true });
    });
});

app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await SignupModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a token and set its expiration
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `http://localhost:3000/reset-password/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ error: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset email sent' });
        });
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to handle password reset
app.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await SignupModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(3001, () => {
    console.log("Server is Running");
});
