import mongoose from 'mongoose'

const ownerSchema = new mongoose.Schema({

    fullName: String,
    email: String,
    phoneNumber: String,
    password: String,

})

const CampownerSignupModel = mongoose.model("campowners", ownerSchema)

export default CampownerSignupModel;