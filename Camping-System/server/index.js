import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import SignupModel from './models/campUser.js';
import CampownerSignupModel from './models/CampOwner.js';
import NewCampModel from './models/Camp.js';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import axios from "axios";
import { REACT_APP_GOOGLE_MAPS_KEY } from './constants.js';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.post("/signup", (req, res) => {
    SignupModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

app.post("/signupowner", (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            CampownerSignupModel.create({ fullName, email, phoneNumber, password: hash })
                .then(campowners => res.json(campowners))
                .catch(err => res.json(err));
        }).catch(err => console.log(err.message))

});

app.post("/loginowner", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await CampownerSignupModel.findOne({ email: email });
        if (user) {
            // Compare the provided password with the hashed password stored in the database
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    // Handle error
                    console.error("Error comparing passwords:", err);
                    res.status(500).json({ error: "Server error" });
                    return;
                }
                if (result === true) { // Check if passwords match explicitly
                    const tokens = jwt.sign({ id: user._id }, "jwt-secret-key", { expiresIn: "1d" });

                    res.cookie("token", tokens, { domain: 'localhost', httpOnly: true });
                    // Passwords match, login successful
                    res.json({ message: "Login successful", redirect: "/CampOwner" });
                } else {
                    // Passwords don't match, invalid credentials
                    res.status(401).json({ error: "Invalid credentials" });
                }
            });
        } else {
            // User not found, invalid credentials
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        // Server error
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
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
        cb(null, 'public/profile_pictures');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const profilePictureUpload = multer({ storage: profilePictureStorage });

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
            fs.unlinkSync('public/profile_pictures/' + campowner.profilePicture);
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
            const profilePicturePath = path.join(__dirname, 'public/profile_pictures', campowner.profilePicture);
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

app.listen(3001, () => {
    console.log("Server is Running");
});
