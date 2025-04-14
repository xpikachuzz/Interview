import React from 'react'
import useFetch from './../customHooks/useFetch';
import { supabase } from './../createClient';
import { NavLink } from 'react-router-dom';

export const Home = () => {
  const {loading, result, error, setResult, setError, setLoading} = useFetch(
    () =>
        supabase
            .from('Recruiter')
            .select(`*`),
    []
  );

  if (loading) {
      return <h1 className="text-3xl font-bold text-center">Loading...</h1>;
  }

  if (error || result.error) {
      return (
          <h1 className="text-3xl font-bold text-center">
            {error.message || result.error.message}
          </h1>
      );
  }


  return (
    <div className="p-10 flex flex-col gap-10">
      <h1 className="text-5xl font-bold">Companies</h1>
      {
        result.data.map(({company_name, description, id}) => (
          <div key={id} className="border-[1px] px-6 py-3 rounded-md">
            <NavLink to={`/recruiter/${id}`} className="">
              <h1 className="text-3xl font-bold break-all">{company_name}</h1>
              <p className="">{description}</p>
            </NavLink>
          </div>
        ))
      }
    </div>
  )
}
