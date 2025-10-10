import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";



// api to get now  playing movies from TMDB API
export const getNowPlayingMovies =async(req , res)=>{
    try {
      const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
            headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
        })
        const movies=data.results;
        res.json({success:true , movies:movies})
    } catch (error) {
        console.log(error)
        // console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY);

        res.json({success:false ,message: error.message})
    }
}

//API to add new show  to the database


export const addShow= async(req , res)=>{
    try {
        const {movieId , showsInput , showPrice} = req.body
        let movie= await Movie.findById(movieId)
        
        if(!movie) {
            // fetch movie details from tmdb 
            const [movieDetailsResponse , movieCreditsResponse] =await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
            headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`} }) ,
         
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits` ,{
            headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`} } ),
           
           ]);

           const movieApiData=movieDetailsResponse.data;
           const movieCreditsData=movieCreditsResponse.data 

           const movieDetails={
            _id:movieId,
            title:movieApiData.title,
            overview:movieApiData.overview,
            poster_path:movieApiData.poster_path,
            backdrop_path: movieApiData.backdrop_path,
            genres:movieApiData.genres,
            casts:movieApiData.cast || movieCreditsData.cast.slice(0, 12),
            release_date:movieApiData.release_date,
            original_language:movieApiData.original_language,
            tagline:movieApiData.tagline|| "",
            vote_average:movieApiData.vote_average,
            runtime:movieApiData.runtime
           }

           //add movie to database

           movie=await Movie.create(movieDetails)
        }
       const showsToCreate =[];
       
       showsInput.forEach(show => {
         const showDate =show.date;
         show.times.forEach((time)=>{
            const dateTimeString =`${showDate}T${time}`;
            showsToCreate.push({
                movie:movieId,
                showDateTime :new Date(dateTimeString),
                showPrice,
                occupiedSeats:{}
            })
         })
       });

       if(showsToCreate.length > 0){
        await Show.insertMany(showsToCreate);
       }

       res.json({success:true , message:"Show Added Successfully"})


    } catch (error) {
         console.log(error)
        res.json({success:false ,message: error.message})
    }
}

//API TO GET ALL SHOWS FROM THE DB

export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime: {$gte:new Date()}}).populate('movie').sort({showDateTime: 1});

        //filter unique shows 
        const uniqueShows = new Set(shows.map(show => show.movie))

        
        res.json({ success: true, shows : Array.from(uniqueShows) });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
        
        
    }
} 
//api to get  showPoster from db

export const getShowPoster = async (req, res  ) => {
    try {
        // Find active shows (date >= today)
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate({
                path: 'movie',  // populate movie details
                select: 'poster_path backdrop_path title overview runtime genres _id '
            });

        console.log(shows, "found shows:");

        // Map only the info you want
        const posters = shows.map(show => ({
            _id:show.movie._id,
            poster: show.movie.poster_path,
            title: show.movie.title,
            overview: show.movie.overview,
            runtime: show.movie.runtime,
            genres: show.movie.genres,
            showDateTime: show.showDateTime,
            backdrop_path:show.movie.backdrop_path
        }));
        // console.log(posters , "poster");
        

        res.json(posters); // send to frontend
        // next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//api to get single show from db

export const getSingleShow = async (req, res) => {
    try {
        const {movieId} = req.params;
        //get all upcomming shows for the movies
        const shows = await Show.find({movie:movieId, showDateTime: {$gte :new Date() }})
        const movie = await Movie.findById(movieId);
        const dateTime ={};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split('T')[0];

            if (!dateTime[date]) {
            dateTime[date] = [];
            }
        dateTime[date].push({time:show.showDateTime,showId:show._id})
        })
        
        res.json({ success: true, movie,dateTime })
        console.log(`Fetched show for movie ${movieId}`);
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message  });
        console.log('idhar dikkat h ');
        
    }
}

