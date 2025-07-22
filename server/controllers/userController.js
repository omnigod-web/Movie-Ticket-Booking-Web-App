import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

// api Controller function to get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId;

        const bookings= await Booking.find({ user }).populate({
            path:"show",
            populate: {path: "movie"}
        }).sort({ createdAt: -1 });
        res.json({
            success: true, bookings
        });

        }catch (error) {

        console.log(error);
            
         res.json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// Api controller function to Update Favourite movie in clerk User metadata

export const UpdateFavorite = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { movieId } = req.body;
         const user = await clerkClient.users.getUser(userId)
         if(!user.privateMetadata.favourites){
            user.privateMetadata.favourites = [];
         }
         if(!user.privateMetadata.favourites.includes(movieId)){
            user.privateMetadata.favourites.push(movieId);
         }
         else{
            user.privateMetadata.favourites = user.privateMetadata.favourites.filter(item => item !== movieId);
         }
         await clerkClient.users.updateUserMetadata(userId, { pruvateMetadata: user.privateMetadata });
       
        res.json({
            success: true,
            message: "Favourite movie updated successfully",
            user: userUpdate
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}

export const getFavorites = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites =user.privateMetadata.favorites;

        //get movies from db
        const movies = await Movie.find({ _id: { $in: favorites } });

        
        res.json({
            success: true,
            favourites: movies
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}