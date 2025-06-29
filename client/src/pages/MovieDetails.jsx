import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../assets/lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'

const MovieDetails = () => {
    const navigate = useNavigate()
    const {id} = useParams()  //use to access url parameter for eg:- humlog url se id le rhe hai eg(url):- http://localhost:5173/movies/324544 use store id- 324544-
    const [Show ,setShow]=useState(null)

     const getShow=()=>{
        const Show=dummyShowsData.find(show => show._id===id)
        if(Show){
          setShow({
            movie:Show,
            dateTime:dummyDateTimeData
        })
        }
        
     }
     useEffect(()=>{
        getShow() 
     },[id])
    
    
    return Show ?(
      <div className="px-6 md:px:16 lg:px-40 pt-30 ,md:pt-50">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
           <img src={Show.movie.poster_path} alt="" className='max-md:mx-auto rounded-xl
            h-104 max-w-70 object-cover'/>
            <div className='relative flex flex-col gap-3 '>
               <BlurCircle top="100px" left="100px" />
               <p className='text-primary'>ENGLISH</p>
               <h1 className="text-4xl font-semibold max-w-96 text-balance">{Show.movie.title}</h1>
                <div className="flex items-center gap-2 text-gray-300">
                    <StarIcon className='w-5 g-5 text-primary fill-primary' />
                     {Show.movie.vote_average.toFixed(1)} User Rating
                </div>
                <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>
                    {Show.movie.overview}
                </p>
                <p>
                    {timeFormat(Show.movie.runtime)} * {Show.movie.genres.map(genre=>genre.name).join(", ")} * {Show.movie.release_date.split("-")[0]}
                </p>
                <div className="flex flex-row flex-wrap w-auto h-auto items-center gap-4 mt-5">
                  <button className="flex gap-2 border-2 rounded-3xl  px-3 py-3 items-center bg-primary cursor-pointer transition active:scale-95 hover:bg-primary-dull md:w-40   ">
                    <PlayCircleIcon className='w-5 h-5'  />
                      Watch Trailer
                  </button>
                  <a href="#dateSelect" className="flex gap-2 border-2 rounded-3xl  px-3 py-3 items-center bg-primary transition active:scale-95 hover:bg-primary-dull  ">
                    Buy Tickets 
                  </a>
                  <button className="cursor-pointer bg-gray-700 p-2.5 rounded-full transition active:scale-95">
                    <Heart className={`w-5 h-5`}   />
                  </button>
                </div>

            </div>
        </div>
       
       <p className='text-lg font-medium mt-20'>
        Your Favorite Casts
       </p>
       <div className="overflow-x-auto no-scollbar mt-8 pb-4">
        <div className="flex items-center gap-3 w-max px-3">
          {Show.movie.casts.slice(0,12).map((cast, index)=>(
            <div className="flex flex-col items-center text-center" key={index}>
              <img src={cast.profile_path} alt="" className='rounded-full w-20 h-20 object-cover aspect-square' />
              <p className='font-medium text-sm text-shadow-2xl mt-3'>{cast.name}</p>
            </div>
          ))}

        </div>
        </div> 



       <DateSelect dateTime={Show.dateTime} id={id} />
         
       <p className='text-lg font-medium mt-20 mb-8'> You may also like</p>
       <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.slice(0,4).map((movie ,index)=>(
          <MovieCard key={index} movie={movie} />
        ))}
       </div>
       <div className="flex justify-center mt-20">
        <button onClick={()=> { {navigate('/movies')} ; scrollTo(0,0)}} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull 
                           transition rounded-md font-medium cursor-pointer">
                Show more
        </button>
       </div>


      </div>
       
    ):(
      <Loading />
    )
}
export default MovieDetails