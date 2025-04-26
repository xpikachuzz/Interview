import React from 'react'
import { ScrollCard } from './ScrollCard'


export const ScrollWindow = ({data}) => {

  return (
    <div id='scroll' className='relative flex flex-col items-center justify w-full gap-5 text-blue-800 '>
      <h1 className=' text-5xl font-bold font-mono underline text-center w-full -ml-40'>Companies hiring</h1>
      {
        data.map(
          ({company_name, description, id, Form}, i) => (
            <ScrollCard company_name={company_name} description={description} Form={Form} key={i} i={i} id={id} />
          )
        )
      }
    </div>
  )
}
