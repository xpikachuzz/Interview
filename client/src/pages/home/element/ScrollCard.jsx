import React, { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/all';
import gsap from 'gsap';

export const ScrollCard = ({company_name, description, id, i, Form}) => {

  const {contextSafe} = useGSAP()


  const onMouseEnter = contextSafe(()=> {
    gsap.to(document.getElementById(`description/${i}`), {
      scale: 1.1,
      duration: 0.4
    })
  })

  const onMouseMove = contextSafe((e)=> {
    gsap.to(document.getElementById(`description/${i}`), {
      translateY: `${(e.movementY-3)*10}%`,
      duration: 1.5
    })
  })

  const onMouseLeave = contextSafe(()=> {
    gsap.to(document.getElementById(`description/${i}`), {
      scale: 0,
    })
  })

  return (
    <Link
      to={`recruiter/${id}`} 
      onMouseEnter={onMouseEnter} 
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave} 
      className="border-y-[1px] border-slate-300 px-6 py-3 w-full justify-center items-center text-blue-600 relative flex "
    >
      <h1 className="text-3xl font-bold break-all w-5xl max-xl:w-screen max-xl:pl-10 ">
        {i+1}. {company_name}
      </h1>
      <div id={`description/${i}`} className='bg-blue-700 z-20 scale-0 absolute p-[5px] right-10 w-3/12 -translate-y-2/5 -translate-x-full rounded shadow-2xl '>
        <div className='bg-slate-100 w-full rounded p-2 flex flex-col gap-[0.6px] max-h-64 overflow-y-hidden '>
          <h3 className='text-lg font-semibold'>Description:</h3>
          {description}
        </div>
      </div>
      <h2 className='text-xl font-bold'>Available jobs: {Form.length}</h2>
    </Link>
  )
}
