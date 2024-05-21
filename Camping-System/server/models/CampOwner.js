import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    password: String,
    profilePicture: String, // New field for storing the file name of the profile picture
});

const CampownerSignupModel = mongoose.model("campowners", ownerSchema);

export default CampownerSignupModel;