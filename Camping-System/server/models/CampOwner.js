import mongoose from 'mongoose'

const Owner = new mongoose.Schema({

    fullName: String,
    email: String,
    phoneNumber: String,
    password: String
})


const CampownerSignupModel = mongoose.model("campowners", Owner)

export default CampownerSignupModel;