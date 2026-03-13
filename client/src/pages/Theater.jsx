
// import React from 'react'
// import {dummyShowsData} from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import MovieInsights from '../components/MovieInsights'


const Theater = () => {

    const {shows} = useAppContext();

    return  (
        <MovieInsights />
    )
}
export default Theater