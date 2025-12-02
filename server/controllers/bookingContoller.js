// import { req } from "express";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import stripe from 'stripe' ; 


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
        const {showId,selectedSeats}=req.body
        const {origin} = req.headers;

        //check if the seat is available
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);
        console.log(isAvailable);
        
        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Selected seats are not available" });
        }
        //get the show details
        const showData=await Show.findById(showId).populate('movie');
        //create booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        });
         selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId; //mark seat as occupied)
         })

         showData.markModified('occupiedSeats');
            await showData.save();

         //   stripe Gateway integration
              const stripeInstance= new stripe(process.env.STRIPE_SECRET_KEY)
        // creating line items for stripe 
        const line_items = [{
            price_data :{
                currency : 'aud' , 
                product_data : {
                    name : showData.movie.title
                },
                unit_amount : Math.floor(booking.amount)*100
            },
            quantity : 1
        }]

        const session =await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-bookings`, 
            cancel_url: `${origin}/my-bookings`,
            line_items:line_items,
            mode:'payment',
            metadata:{
                bookingId: booking._id.toString()
            },
            expires_at : Math.floor(Date.now()/1000) + 30 * 60 //Expires in 30 mins
        })

        booking.paymentLink= session.url  
        await booking.save()    //will save payment link in db so that user can retry booking payments 
        
         res.json({success:true, url: session.url});

      
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