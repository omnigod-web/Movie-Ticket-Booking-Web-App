import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true },
    show: { type: String, ref: 'Show', required: true },
    amount: { type: Number, required: true },
    bookedSeats:{type:Array,required:true},
    isPaid: { type: Boolean, default: false },
    paymentLink: { type: String },         
},{timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;