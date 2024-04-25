import mongoose from 'mongoose'

const SignupSchema = new mongoose.Schema({

    username: String,
    email: String,
    password: String
})

const SignupModel = mongoose.model("users", SignupSchema)

export default SignupModel