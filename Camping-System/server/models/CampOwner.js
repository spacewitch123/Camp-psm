import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    password: String,
    profilePicture: String,
    certificate: String, // Field to store the file name of the certificate
    isApproved: { type: Boolean, default: false } // Field to store approval status
});

const CampownerSignupModel = mongoose.model("campowners", ownerSchema);

export default CampownerSignupModel;
