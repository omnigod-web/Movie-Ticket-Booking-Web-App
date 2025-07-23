import React, { use, useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { CheckIcon, DeleteIcon, StarIcon, Target } from 'lucide-react'
import { kConverter } from '../../assets/lib/kConverter'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
// import { set } from 'mongoose'

const AddShows = () => {

  const {axios , getToken , user,image_base_url}=useAppContext();
  const currency=import.meta.env.VITE_CURRENCY
   
  const[nowPlayingMovies , setnowPlayingMovies] =useState([])
  const[selectedMovies ,setSelectedMovies]=useState(null)
  const[ dateTimeSelection ,setdateTimeSelection]=useState({})

  const[dateTimeInput ,setdateTimeInput]=useState('')
  const[showPrice ,setshowPrice]=useState('')

  const [addingShow, setAddingShow] = useState(false);
  
  const  fetchNowPlayingMovies = async () =>{
     try {
       const {data} = await axios.get('/api/show/now-playing', {
         headers: { Authorization: `Bearer ${await getToken()}` }
       });
       if(data.success){
         setnowPlayingMovies(data.movies);
       }
       else {
         toast.error(data.message || 'Failed to fetch now playing movies');
       }
     } catch (error) {
       console.error('Error fetching now playing movies:', error);
       toast.error('Failed to fetch now playing movies');
     }
  }
  const handleDateTimeAdd =()=>{
    if(!dateTimeInput) return;
    const[date,time] =dateTimeInput.split('T');
    if(!date || !time) return;
    setdateTimeSelection((prev)=>{
      const times=prev[date] || [];
      if(!times.includes(time)){
        return{...prev , [date]:[...times,time]}
      }
      return prev;
    })
  }

  const handleRemoveTime =(date , time)=>{
    setdateTimeSelection((prev)=>{
      const filteredTimes = prev[data].filter((t)=> t!=time);
      if(filteredTimes.length===0){
        const{[data]: _, ...rest } =prev;
        return rest;
      }
      return {
        ...prev,[date]:filteredTimes,
      }
    })
  }
  const handleSubmit = async () => {
    try {
       setAddingShow(true);
       if(!selectedMovies || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
        toast.error('Please select a movie, date/time, and enter a show price');
        return;
        }
      const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => ({ date, times }));
      const payload = {
        movieId:selectedMovies,
        showsInput,
        showPrice:Number(showPrice),
      }
      const {data} = await axios.post('/api/show/add', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if(data.success){
        toast.success('Show added successfully'); 
        setSelectedMovies(null);
        setdateTimeSelection({});
        setshowPrice('');
      }
      else {
        toast.error( 'Failed to add show ' + (data.message || ''));
      }
    }
     catch (error) {
      console.error('Error adding show:', error);
      toast.error('Failed to add show');
    }
    setAddingShow(false);
  }

  useEffect(()=>{
    if(user){
      fetchNowPlayingMovies();
    }
    
  },[user])
  return nowPlayingMovies.length > 0 ? (

   
   <>
   <Title text1='Add' text2='Shows' />
   <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
   <div className="overflow-x-auto pb-4">
    <div className="group flex flex-wrap gap-4 mt-4 w-max">
      {nowPlayingMovies.map((movie)=>(
        <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`} onClick={()=> setSelectedMovies(movie.id)  }>
          
          <div className="relative rounded-lg overflow-hidden">
            <img src={image_base_url + movie.poster_path} alt="" className="w-full object-cover brightness-90" />
            <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0  ">
              <p className="flex items-center gap-1 text-gray-400">
                <StarIcon className='w-4 h-4 text-primary fill-primary ' />
                {movie.vote_average.toFixed(1)}
              </p>
              <p className="text-gray-300"> {kConverter(movie.vote_count)} Votes </p>
            </div>
          </div>
          {selectedMovies === movie.id &&(
            <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded  ">
              <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
            </div>
          )}
          <p className="font-medium truncate"> {movie.title} </p>
          <p className="text-gray-400 text-sm "> {movie.release_date} </p>
        </div>
      ))}
    </div>
   </div>
    {/* Show Price inputs */}
   
   <div className="mt-8">
    <label  className=" block text-sm font-medium mb-2  "> Show Price</label>
    <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md ">
      <p className="text-gray-400 text-sm"> {currency}  </p>
      <input  className="outline-none " min={0} type='number' value={showPrice} onChange={(e)=> setshowPrice(e.target.value)} placeholder='enter show Price'  />
    </div>
   </div>
    
    {/* Date and time  */}
    <div className="mt-6">
      <label  className="block text-sm font-medium mb-2"> Select Date and Time</label>
      <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
        <input type="datetime-local" value={dateTimeInput} onChange={(e)=>setdateTimeInput(e.target.value)} className="outline-none rounded-md" />
        <button type='calander' onClick={handleDateTimeAdd} className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"> Add Time</button>
      </div>
    </div>
   
   {/* display selected time  */}

   {Object.keys(dateTimeSelection).length > 0 && (
    <div className="mt-6">
      <h2 className="mb-2 "> Selected Date Time</h2>
      <ul className="space-y-3">
        {Object.entries(dateTimeSelection).map(([date ,times])=>(
          <li key={date}>
            <div className="font-medium "> {date} </div>
            <div className="flex flex-wrap gap-2 mt-1 text-sm ">
              {times.map((time)=>(
                <div key={time} className="border border-primary px-2 py-1 flex items-center rounded">
                  <span>{time}</span>
                  <DeleteIcon onClick={()=> handleRemoveTime(date , time)} width={15} className='ml-2 text-red-500 hover:text-red-700 cursor-pointer' />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
   )}
   
   <button onClick={handleSubmit} disabled={addingShow} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer "> Add Shows</button>

   </>


  ):<Loading/>
}

export default AddShows