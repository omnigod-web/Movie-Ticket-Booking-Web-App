import  { useEffect } from 'react'

import { useState } from "react"
import BlurCircle from './BlurCircle'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'

 


const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState("");
  const [trailerLink, setTrailerLink] = useState({});
  const { shows } = useAppContext();
  const{image_base_url} =useAppContext();

  const api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTI3YzQ5NGFlN2I1ZGJiYzE5NTFlNjA0MmI5Mjk1NCIsIm5iZiI6MTczNzk1NTAzMy40NjU5OTk4LCJzdWIiOiI2Nzk3MTZkOTI1ZDI5ODBmYjAyNDA5MTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nKs4OMQBnQkTNqZKPUh5HQGjusZdyAL96bIY_KyUM0c"


  // 1. Extract movie IDs from shows
  // useEffect(() => {
  //   if (shows && shows.length > 0) {
  //     const trailerIds = shows.map(show => ({
  //          id: show._id,
  //          poster: show.poster_path
  //     }));
  //     setCurrentTrailer(trailerIds);
  //   }
  // }, [shows]);
  // 2. Fetch trailer links for each movie ID
 
  
  useEffect(() => {
    const fetchTrailerLinks = async () => {
      const trailerMap = {};

      for (const show of shows) {
        try {
          
          const res= await axios.get(`https://api.themoviedb.org/3/movie/${show._id}/videos`,{
            headers:{Authorization:`Bearer ${api_key}`} })
          const trailer = res.data.results.find(
            (vid) => vid.site === "YouTube"
          );

           trailerMap[show._id] = `https://www.youtube.com/watch?v=${trailer.key}`;
        //  console.log(trailerMap ,"___>>>");
         
        } catch (err) {
          console.error(`Trailer fetch error for id ${show._id}`, err);
        }
      }

      setTrailerLink(trailerMap);
    };

    if (shows.length > 0) {
      fetchTrailerLinks();
    }
  }, [shows]); // 👈 re-run when IDs change

  console.log(trailerLink, "TRAILER LINKS MAP");
    const Link = Object.values(trailerLink) 
  
   useEffect(() => {
  if (trailerLink) {
    const Link = Object.values(trailerLink)[0];
    setCurrentTrailer(Link);
  }
}, [trailerLink]);
    return (
       <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
          <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
            Trailer</p>
            
          <div className=" relative mt-5 ">
            < BlurCircle top='-100px' right='-100px' />
          <ReactPlayer url={currentTrailer? currentTrailer:""}   
           className=" mx-auto max-w-full " width='960px' height='540px'   />
          </div>
          <div className=" group grid grid-cols-4 gap-4 md:gap-8 mt-8
              max-w-3xl mx-auto">
                {shows.map((show)=>{ return (
                    <div key={show.poster_path} className='relative bg-amber-400 group-hover:not-hover:opacity-50 hover: -translate-y-1 duration-300transition max-md:h-60 md:max-h-60 cursor-pointer'
                       onClick={()=>{
                        setCurrentTrailer(trailerLink[show._id])
                       }}>
                        <img src={image_base_url+show.poster_path} alt="trailer" 
                        className='rounded-lg w-full h-full object-cover brightness-75'/>
                        <PlayCircleIcon strokeWidth={1.7} className='absolute top-1/2 left 1/2 
                        w-5 md:w-8 h-5 md:h-12 transform translate-x-1/2 translate-y-0.5' />
                    </div>

                )})}
            </div>
       </div>
    )
}
 export default TrailerSection