import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './navbar.css';

function Navbar() {
  return (
    <div className='w-full p-4 flex justify-between px-12 py-4 shadow'>
      <div>
        <img src={logo} alt="Logo" className='sm:h-[35px] md:h-[50px] xs:[35px] block xs:hidden'/>
      </div>
      <div className='flex justify-center gap-8 font-semibold sm:text-lg text-sm h-full items-center'>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
      </div>
      <div className='flex justify-center gap-8'>
        <Link to='/service'> 
          <button className="button-35" role="button">Request for Service</button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
