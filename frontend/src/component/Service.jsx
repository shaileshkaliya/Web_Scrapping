import React from 'react'
import Navbar from './Navbar'

function Service() {
  return (
    <div className="flex flex-col gap-8">
        <Navbar />
        <div className='w-full p-4 shadow h-full'>
            <p className='text-lg'>
                This page is under development...
            </p>
        </div>
    </div>
  )
}

export default Service;