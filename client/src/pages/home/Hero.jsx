import React from 'react'

export const Hero = () => {
  return (
    <div className='w-full h-screen p-5 bg-blue-700'>
      <div className="flex flex-row gap-10 h-full rounded-xl bg-gray-100 relative z-0">
        <div className='w-3/5 px-10 flex flex-col gap-10 justify-center items-center'>
          <h1 className='text-5xl font-bold text-center text-blue-600'>Lorem ipsum dolor sit amet consectetur.</h1>
          <div className='flex items-center justify-center w-fit bg-gray-300 gap-2 rounded-lg p-2'>
            <button className='px-6 py-3 text-sm rounded-lg font-bold bg-blue-700 text-white  hover:cursor-pointer hover: hover:bg-blue-600/90 hover:shadow-lg'>Lorem, ipsum dolor <b className='font-extrabold ml-2'>{"⪢"}</b></button>
            <button className='px-6 py-3 text-sm rounded-lg font-bold  text-blue-600 hover:cursor-pointer hover: hover:bg-gray-400/20 hover:shadow-lg'>Lorem sit amet <b className='font-extrabold ml-2'>{"⪢"}</b></button>
          </div>
        </div>
        <div className='w-2/5 h-full relative rounded-xl'>
          <img 
            src="https://assurancevisiteurs.ca/wp-content/uploads/2024/01/Image-page-accueil.webp" 
            className='absolute w-full h-full object-cover py-2 pr-2 rounded-2xl'
          />
        </div>
      </div>
    </div>
  )
}
