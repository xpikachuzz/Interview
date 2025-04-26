import React, { useState } from 'react'

export const Contact = () => {
  const [contact, setContact] = useState("")
  const [contactSent, setContactSent] = useState("")

  return (
    <div className='w-full h-screen p-5 bg-blue-700'>
      <div className="flex flex-row gap-10 h-full rounded-xl bg-gray-100 relative z-0">
        <div className='w-2/5 h-full relative rounded-xl max-sm:hidden'>
          <img 
            src="https://www.infotrack.com.au/wp-content/uploads/customer-support-team.jpg" 
            className='absolute w-full h-full object-cover py-2 pl-2 rounded-2xl'
          />
        </div>
        <div className='w-3/5 max-sm:w-full px-10 flex flex-col gap-10 py-40 justify-evenly items-center'>
          <h1 className='text-5xl font-bold text-center text-blue-600'>Need help?</h1>
          <div className='w-full flex flex-col gap-4 items-center justify-center'>
            <h1 className='text-3xl font-bold text-center text-blue-600'>Contact us</h1>
            <h3 className='text-xl font-bold text-center text-blue-600'>Send us a message</h3>
            <textarea onChange={(e) => setContact(e.target.value)} value={contact} className='bg-slate-200 w-4/5 min-h-20 border-[1px] border-black rounded-md p-1' />
            <h3 className='text-lg font-semibold text-center text-green-600'>{contactSent && "Message sent!"}</h3>
            <button onClick={() => {setContactSent(true)}} className='text-xl font-bold text-center text-blue-600 px-2 py-1 border-[1.5px] rounded-md hover:pointer-cursor hover:shadow-lg hover:bg-gray-200'>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
