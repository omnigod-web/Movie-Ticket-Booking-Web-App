

//api to check if user is admin

// import { populate } from "dotenv";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

export const isAdmin = async (req, res) => {
    res.json({sucess: true, isAdmin: true});
}

//api to get dashboard data
export const getDashboardData = async (req, res) => {
   try {
     const bookings =await Booking.find({isPaid: true})
     const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');
     const totalUser=await User.countDocuments();

     const dashboardData={
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
        activeShows,
        totalUser
     }
     res.json({success: true,dashboardData});
    //  console.log(`movie schema ${Movie}`);
     
   } catch (error) {
    console.log(error);
    res.json({success: false, message: "Failed to fetch dashboard data"});
    
   }
}

   //Api to get All shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime: 1});
        res.json({ success: true, shows });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch shows byv server " });
    }
}

//api to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('show').populate('user') .populate({
            path:"show",
            populate: { path: "movie" }
        }).sort({createdAt: -1});
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch bookings in server " });
    }
}
  