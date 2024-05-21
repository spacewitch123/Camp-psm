import mongoose from 'mongoose';

const CampSchema = new mongoose.Schema({
    campName: String,
    capacity: Number,
    price: Number,
    latitude: Number,
    longitude: Number,
    images: [String],
    // New Fields
    campType: {
        type: String,
        enum: ['RV', 'Forest Camp', 'Stay Home'],  // Define allowed values// or remove if you want this to be required
    },
    numberOfUnits: {
        type: Number,
        min: 1,  // Ensure at least 1 unit
        default: 1
    },
    description: String,
    phoneNumber: String,
    socialMedia: String,
    amenities: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'campowners' },

    // Store as a comma-separated list or use an array if needed
});

const NewCampModel = mongoose.model("newcamps", CampSchema);

export default NewCampModel;
