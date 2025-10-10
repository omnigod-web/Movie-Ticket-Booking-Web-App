import React, { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRight, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../assets/lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const SeatLayout = () => {
    const groupRows = [['A','B'] , ['C' ,'D'],['E','F'],['G','H'],['I','J']]
    
    const { id ,date} =useParams()
    const [selectedSeats , setselectedSeats] =useState([])
    const [selectedTime , setselectedTime] =useState(null)
    const[show ,setShow]=useState(null)
    const [occupiedSeats, setOccupiedSeats] = useState([]);

    const navigate=useNavigate()
    const {axios, getToken, user} = useAppContext();
    
    const getShow = async ()=>{
        try {
            const {data} = await axios.get(`/api/show/${id}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if(data.success){
                setShow(data);
                console.log('data' , data);
                
            } else {
                toast.error('Failed to fetch show details');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching show details');
        }
    }

     const handleSeatClick=(seatId)=>{
        if(!selectedTime){
            return toast('please select time first')
        }
        if(!selectedSeats.includes(seatId)&& selectedSeats.length>4){
            return toast('you can only select 5 seats')
        }
        setselectedSeats(prev=>prev.includes(seatId)? prev.filter(seat=>seat!==seatId):[...prev ,seatId])
     }


    const renderSeats=(row , count=9)=>(
       <div key={row} className='flex gap2 mt-2'>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({length:count} , (_, i) =>{
                    const seatId=`${row}${i+1}`;
                    return(
                        <button key={seatId} onClick={()=>handleSeatClick
                            (seatId)} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer 
                                ${selectedSeats.includes(seatId) &&"bg-primary text-white"}
                                ${occupiedSeats.includes(seatId) && "bg-gray-400 text-white cursor-not-allowed"}`}>
                                    {seatId}
                        </button>
                    )
                })}
            </div>
       </div> 
    )

    const getOccupiedSeats = async () => {
        try { 
            const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
            
            if (data.success) {
                setOccupiedSeats(data.occupiedSeats);
            } else {
                toast.error('Failed to fetch occupied seats' ,data.message);
            }
        }catch(error){
            console.error(error);
            toast.error('An error occurred while fetching occupied seats');
        }
    }
    useEffect(()=>{
      getShow()
    },[])

    useEffect(() => {
        if (selectedTime) {
            getOccupiedSeats();
        }
        },[selectedTime]);

    return show?(
       <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">

        {/*available timmings*/}

        <div className="w-60 bg-primary/20 border border-primary/40 rounded-lg py-10
                        h-max md:sticky md:top-30">
              <p className='text-lg font-semibold px-6'>Available Timming</p> 
            <div className="mt-5 space-y-1">
                {show.dateTime[date].map((items)=>(

                    <div key={items.id} onClick={()=> setselectedTime(items)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md
                        cursor-pointer transition ${selectedTime?.time ===items.time ? "bg-primary text-white": 'hover:bg-primary/20'}`}>
                        <ClockIcon className='w-5 h-5' />
                        <p className="text-sm">{isoTimeFormat(items.time)}</p>
                    </div>
                   
                ))}
            </div>
        </div>
        
         {/*seat layout*/}

        <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
              <BlurCircle top='-100px' left='-100px'/>
              <BlurCircle top='0' right='0'/>
             
             <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
             <img src={assets.screenImage} alt="screen" />
             <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>
            
            <div className="flex flex-col items-center mt-6 text-xs text-gray-300">
                <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
                    {groupRows[0].map(row=>renderSeats(row))}
                </div>
                    <div className="grid grid-cols-2 gap-5">
                {groupRows.slice(1).map((group ,idx)=>(
                    <div key={idx} className="">
                        {group.map(row => renderSeats(row))}
                    </div>
                ))}
            </div>
         </div>

        <button onClick={()=> navigate('/my-bookings')} className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hove:bg-primary-dull transition rounded-full
        font-medium cursor-pointer active:scale-95">
            Proceed to checkout
            <ArrowRight strokeWidth={3}className='w-5 h-5' />
        </button> 

         </div>



    </div>
    ): (
        <Loading />
    )
}
export default SeatLayout