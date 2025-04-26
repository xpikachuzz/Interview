import React, { useEffect, useRef, useState } from 'react'
import useFetch from '../../customHooks/useFetch';
import { supabase } from '../../createClient';
import { Hero } from './Hero';
import { ScrollWindow } from './element/ScrollWindow';
import { Loading } from '../../element/Loading';
import { Contact } from './Contact';
import { Recruiter } from './Recruiter';



export const Home = () => {
  const {loading, result, error} = useFetch(
    () =>
        supabase
            .from('Recruiter')
            .select(`*, Form (*)`),
    []
  );


  console.log(result, error)

  if (loading) {
      return <Loading />
  }

  if (error || result.error) {
    const errMessage = (error) ? error.message : result.error.message
    return (
      <h1 className="text-3xl text-slate-100 font-extrabold fixed left-1/2 top-1/2 -translate-1/2">
        ERROR: {errMessage}
      </h1>
    );
  }



  return (
    <div className='w-screen'>
      <Hero />

      {/* Make a list of Recruiters */}
      <div className='min-h-screen flex flex-col items-center mx-auto p-5 py-20 bg-slate-100'>
        <ScrollWindow data={result.data} />
      </div>

      {/* Contact Us */}
      <Contact />

      {/* For Recruiters */}
      <Recruiter/>
    </div>
  )
}
