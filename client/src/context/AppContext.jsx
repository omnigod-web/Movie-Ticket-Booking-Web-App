import { createContext,useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3003';

export const AppContext = createContext();


export const AppProvider = ({ children }) => {
    const [isAdmin ,setIsAdmin] = useState(false);
    const [shows ,setShows] = useState([]);
    const [favoriteMovies ,setFavoritesMovies] = useState([]);
    const {user}=useUser();
    const {getToken} =useAuth();
    const location=useLocation();
    const navigate = useNavigate();


    const fetchIsAdmin = async () => {
        try {   
            const {data}= await axios.get('/api/admin/is-admin',{headers: 
                {Authorization: `Bearer ${await getToken()}`}})
               setIsAdmin(data.isAdmin);

            if(!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/'); // Redirect to home if not admin
                toast.error('You are not authorized to access this page');
            }
             
            console.log('Admin status fetched:', data.isAdmin);
            
        } catch (error) {
            console.error('Error fetching admin status:', error);
            toast.error('Failed to verify admin status');
        }
    }
    const fetchShows = async () => {
        try {
            const {data} = await axios.get('/api/show/all');
            if(data.success){
                setShows(data.shows);
            }
            else {
                toast.error(data.message || 'Failed to fetch shows');
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
            toast.error('Failed to fetch shows');
        }
    }
    const fetchFavoriteMovies = async () => {
        try {
            const {data} = await axios.get('/api/user/favorites',{
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if(data.success){
                setFavoritesMovies(data.favorites);
            }
            else {
                toast.error(data.message || 'Failed to fetch favorite movies');
            }
        } catch (error) {
            console.error('Error fetching favorite movies:', error);
            toast.error('Failed to fetch favorite movies');
        }
    }

    useEffect(() => {
        fetchShows();
    }, []);
    
    useEffect(() => {
        if (user) {

            fetchIsAdmin();
            fetchFavoriteMovies();
        }
    }, [user]);
    const value={
        axios,
        fetchIsAdmin,
        user,getToken,navigate,isAdmin,shows,
        favoriteMovies,
        fetchFavoriteMovies
    }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
export const useAppContext = () => useContext(AppContext);