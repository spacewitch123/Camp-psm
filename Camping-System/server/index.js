import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import SignupModel from './models/campUser.js';
import CampownerSignupModel from './models/CampOwner.js';


const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/Camper")

app.post("/signup", (req, res) => {
    SignupModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))

})

app.post("/signupowner", (req, res) => {
    CampownerSignupModel.create(req.body)
        .then(campowners => res.json(campowners))
        .catch(err => res.json(err))

})

app.post("/loginowner", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await CampownerSignupModel.findOne({ email, password }); // Assuming CampownerSignupModel is the model for camp owners
        if (user) {
            res.json({ message: "Login successful", redirect: "/CampOwner" }); // Send the redirect URL to the client
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
app.post("/loginowner", async (req, res) => {
    const { email, password } = req.body;
    try {
        const campowners = await CampownerSignupModel.findOne({ email, password });
        if (campowners) {
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});




app.listen(3001, () => {
    console.log("Server is Running")
})