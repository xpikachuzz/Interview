import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../../createClient'
import useFetch from '../../../customHooks/useFetch'
import { FormContext } from './../../../context/formContext';

export const AnswerOverlay = ({userId}) => {
  const params = useParams()
  const navigate = useNavigate()

  // Get responses of users who have answered all questions
  const { result, loading, error } = useFetch(async () => {
    const res = await supabase
      .from("Answer")
      .select("user_id, user_email", { distinct: true })
      .eq("form_id", params.formId)     // only users for this form
    
    if (res.error) {
      return res
    } else {
      const seen = new Set();
      return {...res, data: res.data.filter(({ user_id }) => {
        if (seen.has(user_id)) return false;
        seen.add(user_id);
        return true;
      })};
    }
    }, []
  );

  const { result: resultForm, loading: loadingForm, error: errorForm } = useFetch(async () => {
    return supabase
      .from("Question")
      .select("*")
      .eq("form_id", params.formId)
  }, [])

  useEffect(() => {
    if (userId != params.id) {
      navigate(`/recruiter/${params.id}/form/${params.formId}`)
    }
  }, [params, userId, navigate])


  if (loading || loadingForm) {
      return (
          <div>
              <h1>LOADING...</h1>
          </div>
      );
  }

  if (error || result.error || errorForm || resultForm.error) {
    if (error || result.error) {
      return (
        <h1 className="text-3xl font-bold text-center">
            { result.error.message || error.message }
        </h1>
      );
    }  else {
      return (
        <h1 className="text-3xl font-bold text-center">
            { resultForm.error.message || errorForm.message  }
        </h1>
      );
    }
  }


  return (
    <div className='bg-blue-100 w-full flex flex-col items-center'>
      {/* The completed responses */}
        {result.data.map(({user_id, user_email}) => (
          <Link to={user_id} key={user_id} className='flex justify-between px-10 py-2 border-[1px] w-full bg-blue-200'>
            <h1>{user_id}</h1>
            <h1>{user_email}</h1>
          </Link>
        ))
      }
      <FormContext.Provider value={{resultForm}}>
        <Outlet />
      </FormContext.Provider>
    </div>
  )
}
