import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchUser } from '../utils/fetchUser';

// importing required components
import { Sidebar, UserProfile, Products } from '/';



const Home = () => {

  const [ToggleSidebar, SetToggleSidebar] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // getting user access token from localStorage
  const userToken = fetchUser();

  // changing the title of the current page
  document.title = "Homepage | Sasta Bazar";


  // fetching user data from backend when this component mounts
  useEffect(() => {
    
    const fetchUserData = async () => {

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      }

      const resp = await axios.get(`${process.env.REACT_APP_API_URL}/user-auth/get-user`, {headers: headers});

      setUserDetails(resp.data);

      if(resp.data.status === 401) navigate('/login');

      // console.log(resp.data);
      
    }

    fetchUserData();
    // eslint-disable-next-line
  }, [])
  

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [])

  return (
    <motion.div className='flex bg-gray-50 flex-col md:flex-row h-screen transition-height duration-75 ease-out'>

      <motion.div className='hidden md:flex h-screen flex-initial'>
        <Sidebar userDetails={userDetails && userDetails} user={userToken} />
      </motion.div>

      <motion.div className='flex md:hidden flex-row'>

        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => SetToggleSidebar(true)} />

          <Link to="/"><h2>Sasta Bazar</h2></Link>

        </div>

        {ToggleSidebar && (
          <div className='fixed w/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => SetToggleSidebar(false)}/>
            </div>
            <Sidebar userDetails={userDetails && userDetails} user={userToken} closeToggle={SetToggleSidebar}/>
          </div>
        )}

      </motion.div>

      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:username" element={<UserProfile user={userDetails}/>}/>
          <Route path="/*" element={<Products user={userDetails && userDetails}/>}/>
        </Routes>
      </div>


    </motion.div>
  )
}

export default Home;