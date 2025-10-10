import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { ArrowRight, Calendar1Icon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios  from 'axios';
import Loading from './Loading';

import { useAppContext } from "../context/AppContext";


const HeroSection = () => {
    const navigate = useNavigate()
    const {image_base_url} = useAppContext();
    // const {shows}= useAppContext();
    const [poster , setPoster] = useState(null);
    const [overview , setOverview] = useState(null);
    const [title , setTitle] =useState(null);
    const { shows } = useAppContext(); // <-- get data from context
    const [randomPoster, setRandomPoster] = useState("");

  useEffect(() => {
    if (shows.length > 0) {
      const randomShow =
        shows[Math.floor(Math.random() * shows.length)];
      setRandomPoster(randomShow);
    }
  }, [shows]); // runs when shows is updated
    
   
    if(!randomPoster) return <Loading/>
    return (
        <div className='flex flex-col items-start justify-center gap-4
        px-6 md:px-16 lg:px-36 
        bg-cover bg-center h-screen'
        style={{ backgroundImage: `url(${image_base_url+ randomPoster.backdrop_path})` }} >
            <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20' />

            <h1 className="text-3xl md:text-[70px] md:leading-18 font-semibold
                     max-w-110"> {randomPoster.title}</h1>

            <div className="flex items-center gap-4 text-gray-300">
                <span> Action | Adventure | Sci-Fi </span>
                <div className="flex items-center gap-1">
                    <Calendar1Icon className='w-4.5 h-4.5' /> 2018
                </div>
                <div className="flex items-center gap-1">
                    <ClockIcon className='w-4.5 h-4.5' /> 2h 8m
                </div>
            </div>
            <p className="max-w-md text-gray-300">{randomPoster.overview}</p>
            <button onClick={() => navigate('/movies')} className="flex items-centre gap-1 px-6 py-3 text-sm bg-primary
              hover:bg-primary-dull hover:border-x-4 border-primary  trasition rounded-full font-medium cursor-pointer">
                Explore Movies
                <ArrowRight className='w-5 h-5' />
            </button>
        </div>
    )

}
export default HeroSection;