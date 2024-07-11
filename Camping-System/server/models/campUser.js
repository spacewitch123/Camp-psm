import mongoose from 'mongoose'

const SignupSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String }
})

const SignupModel = mongoose.model("users", SignupSchema)

export default SignupModel