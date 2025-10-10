import express from "express"
import { addShow, getNowPlayingMovies, getShowPoster, getShows, getSingleShow } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter =express.Router();

showRouter.get('/now-playing',protectAdmin,getNowPlayingMovies)

showRouter.post('/add', protectAdmin, addShow)

showRouter.get('/all', getShows)
// showRouter.get("/moviePoster" , getShowPoster )
showRouter.get('/:movieId', getSingleShow)

export default showRouter