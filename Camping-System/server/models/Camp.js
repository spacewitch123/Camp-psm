import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    rating: Number,
    review: String,
    createdAt: { type: Date, default: Date.now }
});


const CampSchema = new mongoose.Schema({
    campName: String,
    city: String,
    capacity: Number,
    price: Number,
    latitude: Number,
    longitude: Number,
    images: [String],
    campType: {
        type: String,
        enum: ['RV', 'Forest Camp', 'Stay Home']
    },
    numberOfUnits: {
        type: Number,
        min: 1,
        default: 1
    },
    description: String,
    phoneNumber: String,
    socialMedia: String,
    amenities: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'campowners' },
    reviews: [reviewSchema], // Embedding reviews as a subdocument

});

const NewCampModel = mongoose.model("newcamps", CampSchema);

export default NewCampModel;
