// models/Reservation.js
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    camp: { type: mongoose.Schema.Types.ObjectId, ref: 'newcamps', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    formData: {
        name: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        checkInDate: { type: Date, required: true },
        checkOutDate: { type: Date, required: true },
        numPeople: { type: Number, required: true },
        units: { type: Number, required: true },
    },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    paymentIntent: {
        id: String,
        status: String,
    },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
