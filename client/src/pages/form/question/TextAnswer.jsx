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
    <div className='w-full flex flex-col items-center'>
      <h1 className="text-5xl w-full font-bold pb-2"><b>Question {question_no}. </b>{question}</h1>
      <textarea
          ref={answerRef}
          className="bg-slate-500 border-[1px] border-slate-300 w-full p-1.5  max-2xl:border-2 mt-5"
      />
      <button
          onClick={submitAnswer}
          className="border-[1px] w-fit px-4 py-1 font-medium mt-3 hover:cursor-pointer"
      >
          Submit
      </button>
    </div>
  )
}
