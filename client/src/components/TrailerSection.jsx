import React from 'react'

import { useState } from "react"
import { dummyTrailers } from "../assets/assets"
import BlurCircle from './BlurCircle'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'

 


const TrailerSection = ()=>{
const [currentTrailer , setcurrentTrailer] =useState(dummyTrailers[0])


    return (
       <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
          <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
            Trailer</p>
          <div className=" relative mt-5 ">
            < BlurCircle top='-100px' right='-100px' />
          <ReactPlayer  url={currentTrailer.videoUrl}   
           className=" mx-auto max-w-full " width='960px' height='540px'   />
          </div>
          <div className=" group grid grid-cols-4 gap-4 md:gap-8 mt-8
              max-w-3xl mx-auto">
                {dummyTrailers.map((trailer)=>{ return (
                    <div key={trailer.image} className='relative bg-amber-400 group-hover:not-hover:opacity-50 hover: -translate-y-1 duration-300transition max-md:h-60 md:max-h-60 cursor-pointer'
                       onClick={()=>{
                        setcurrentTrailer(trailer)
                       }}>
                        <img src={trailer.image} alt="trailer" 
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