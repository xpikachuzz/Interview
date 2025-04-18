import React, { useRef } from 'react'
import { supabase } from '../../../createClient';
import { useNavigate } from 'react-router-dom';

export const TextAnswer = ({ question, question_no, form_id, setLoading, setError, userId, nextQuestionNav, email }) => {

  const answerRef = useRef()


  async function submitAnswer() {
    setLoading("Posting answer...");
    // post answer to supaabse
    const result = await supabase.from("Answer").insert({
        question_no: question_no,
        form_id: form_id,
        answer: answerRef.current.value,
        user_id: userId,
        user_email: email
    });

    setLoading();
    if (result.error) {
        setError("Can't send answer to database. Try again later.");
        return;
    }

    //  move to the next question
    await nextQuestionNav()
  }


  
  return (
    <>
      <h1 className="text-5xl font-bold pb-2"><b>{question_no}. </b>{question}</h1>
      <textarea
          ref={answerRef}
          className="bg-slate-100 w-3/4 p-1 max-w-4xl max-2xl:border-2 "
      />
      <button
          onClick={submitAnswer}
          className="border-[1px] w-fit px-4 py-1 font-medium mt-3 hover:cursor-pointer"
      >
          Submit
      </button>
    </>
  )
}
