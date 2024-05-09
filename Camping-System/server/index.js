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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));

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

app.post("/logout", (req, res) => {
    const token = req.cookies.token;
    if (token) {
        // Add token to the blacklist
        tokenBlacklist.add(token);
        // Clear the token cookie from the response
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    } else {
        res.status(400).json({ error: 'No token found' });
    }
});

app.post("/NewCamp", verifyToken, upload.array('images', 10), async (req, res) => {
    const { campName, capacity, price, latitude, longitude } = req.body;

    // Check if req.files exists and if it contains an 'images' property
    if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No images uploaded" });
    }

    try {
        const images = req.files.map(file => file.filename);

        // Construct URLs for the images
        const imageUrls = images.map(filename => `/images/${filename}`);

        // Create a new camp with the image URLs
        const newCamp = await NewCampModel.create({
            campName,
            capacity,
            price,
            latitude,
            longitude,
            images: imageUrls,
            owner: req.userId // Set the owner field to the ID of the camp owner
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

app.listen(3001, () => {
    console.log("Server is Running");
});
