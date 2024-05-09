import mongoose from 'mongoose';

const CampSchema = new mongoose.Schema({
    campName: String,
    capacity: Number,
    price: Number,
    latitude: Number,
    longitude: Number,
    images: [String], // Array of image file paths
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'campowners' } // Reference to the camp owner
});

const NewCampModel = mongoose.model("newcamps", CampSchema);

export default NewCampModel;