import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';


const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out  capitalize';


const Sidebar = ({ user, closeToggle, userDetails }) => {

  const navigate = useNavigate();

  const categories = [
    'Men',
    'Women',
    'Kids',
    'Technology',
    'Decoration',
    'Kitchen'
  ]

  const handleCloseToggle = () => {
    if(closeToggle) closeToggle(false);
  }


  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 h-scrollbar'>
      <div className='flex flex-col'>
        <Link to="/" className="flex px-5 gap-2 my-6 pt-1 w-190 items-center" onClick={handleCloseToggle}>Sasta Bazar</Link>

        <div className='flex flex-col gap-5'>
          <NavLink to="/" className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle} onClick={handleCloseToggle}>
            <RiHomeFill />
              Home
          </NavLink>

          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover Categories</h3>

          {categories.map(category => {
            return (
            <NavLink to={`/category/${category}`} className={({isActive})=> isActive ? isActiveStyle : isNotActiveStyle} onClick={handleCloseToggle} key={category}>
              {category}
            </NavLink> )
          })}

          <div className='px-5 text-base'>
            {user ? (<button className='p-2 bg-blue-700 text-white font-bold rounded-md' onClick={() => {localStorage.clear(); navigate('/login')}}>Logout</button>) : (<button className='p-2 bg-blue-700 text-white font-bold rounded-md' onClick={() => navigate('/login')}>Signin</button>)}
          </div>

        </div>
      </div>

      {
        user && (
          <Link to={`user-profile/${userDetails?.username}`}  className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3" onClick={handleCloseToggle}>{userDetails?.username}</Link>
        )
      }

    </div>
  )
}

export default Sidebar;