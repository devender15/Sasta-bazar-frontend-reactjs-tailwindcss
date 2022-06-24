import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';


const Navbar = ({searchTerm, setSearchTerm}) => {

  const navigate = useNavigate();

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-md">
        <IoMdSearch size={21} className='ml-1'/>
        <input type="text" className='p-2 w-full bg-white outline-none' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="search product" onFocus={() => navigate('/search')}/>
      </div>
    </div>
  )
}

export default Navbar;