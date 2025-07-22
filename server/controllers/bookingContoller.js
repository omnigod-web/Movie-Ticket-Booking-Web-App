import { raw } from "express";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";


//fn to check availability of seats
export const checkSeatAvailability = async (showId , selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false //show not found
        const occupiedSeats = showData.occupiedSeats;
        //check if any of the selected seats are already occupied
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken; //return true if no seats are occupied

    } catch (error) {
        console.log(error.message);
        return false; //return false in case of error
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId} = req.auth();
        const {showId,selectedSeats}=raw.body
        const {origin} = req.headers;

        //check if the seat is available
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);

        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Selected seats are not available" });
        }
        //get the show details
        const showData=await Show.findById(showId).populate('movie');
        //create booking
        const booking = new Booking({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        });
         selectedSeats.map((seat) => {
            booking.occupiedSeats[seat] = userId; //mark seat as occupied)
         })

         showData.markModified('occupiedSeats');
            await showData.save();

         //   stripe Gateway integration

         res.json({sucess:true, message:"Booking created successfully"});

      
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;

        //find the show by id
        const showData = await Show.findById(showId);
        const occupiedSeats=Object.keys(showData.occupiedSeats);
        if (!showData) {
            return res.status(404).json({ success: false, message: "Show not found" });
        }

        res.json({ success: true, occupiedSeats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}