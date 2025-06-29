import React from 'react'
import {dummyShowsData} from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'


const Favorite = () => {
    return dummyShowsData.length > 0 ? (
        <div className="relative my-40 mb-60  md:px-16 lg:px-40 xl:px-44
            overflow-hidden min-h-[80vh]">
           <BlurCircle top="150px" left="0px" />
           <BlurCircle bootom ="50px" right="50px" />
           <h1 className="text-lg font-medium my-4">
             Your Favorite MOvies
           </h1>
           <div className="flex flex-wrap max-sm:justify-center gap-10 md:gap-4 ">
            {
            dummyShowsData.map(
                (movie)=> <MovieCard movie={movie} key={movie._id}/>
            )}
           </div>
        </div>
    ) : (
        <div className="flex flex-col items-center juistify-center h-screen">
            <h1 className='rext-3xl font-bold text-center'>NO MOVIES AVAILABLE</h1>
        </div>
    )
}
export default Favorite