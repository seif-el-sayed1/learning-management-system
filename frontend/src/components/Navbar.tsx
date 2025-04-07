import React from 'react'
import logo from '../assets/logo.webp'
export const Navbar = () => {
    return (
        <div className=" flex justify-between items-center py-4 sm:px-20 md:px-20 px-10 shadow-lg">
            <div className='flex items-center gap-1'>
                <img  className='w-10' src={logo} alt="logo" />
                <h1 className="text-2xl font-bold">Sdemy</h1>
            </div>
            <div>
                <button className="bg-blue-600text-white px-2 sm:px-4 py-1 rounded-xl cursor-pointer duration-300" >
                    Create Account
                </button>
            </div>
        </div>
    )
}
