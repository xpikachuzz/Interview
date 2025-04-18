import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../../createClient';
import useFetch from '../../../customHooks/useFetch';
import { useFormContext } from '../../../context/formContext';

export const UserAnswer = ({userId}) => {
  const params = useParams()
  const navigate = useNavigate()
  const {resultForm} = useFormContext();

  const { result, loading, error, setResult, setError } = useFetch(async () => {
    const res = await supabase
      .from("Answer")
      .select("question_no, answer, user_email")
      .eq("form_id", params.formId)     // only users for this form
      .eq("user_id", params.userId)

    if (res.error) {
      return res
    } else {
      const questions = {}
      resultForm.data.forEach(row => {
        questions[row.question_no] = {type: row.type, question: row.question}
      })
      let questionsAndAnswers = {}
      res.data.forEach(row => {
        questionsAndAnswers[row.question_no] = {...row, ...questions[row.question_no]}
      })


      const data = await Promise.all(
        Object.values(questionsAndAnswers).map(async (row) => 
          (row.type == "video") ? (
          {...row, url: (await supabase
            .storage
            .from("videos")
            .getPublicUrl(`${params.formId}/${row.question_no}/${params.userId}`).data.publicUrl)}
          ) : row
        )
      )

      // join with questions (resultForm)
      return {...res, data};
    }
    }, [params.formId, params.userId]
  );

  console.log(result)

  useEffect(() => {
    if (userId != params.id) {
      navigate(`/recruiter/${params.id}/form/${params.formId}`)
    }
  }, [params, userId, navigate])


  if (loading) {
      return (
          <div>
              <h1>LOADING...</h1>
          </div>
      );
  }

  if (error || result.error) {
      return (
          <h1 className="text-3xl font-bold text-center">
              {error.message || result.error.message}
          </h1>
      );
  }

  return (
    <div>
      {
        result.data.map((row) => (
          <div key={row.question_no}>
            <h1>Question: {row.question_no}</h1>
            <h1>Question: {row.question}</h1>
            {
              // answer
              (row.type == "text") ? (
                <h1>Answer: {row.answer}</h1>
              ) : (
                <video width="100%" controls>
                  <source src={row.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            }
          </div>
        ))
      }
    </div>
  )
}
