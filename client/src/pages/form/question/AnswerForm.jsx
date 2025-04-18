import React from 'react'
import { TextAnswer } from './TextAnswer'
import { VideoAnswer } from './VideoAnswer Copy';

export const AnswerForm = ({ question, question_no, type, form_id, setLoading, setError, userId, nextQuestionNav, email }) => {

  if (type == "text") {
    return (
      <div
      className="flex flex-col justify-start items-start gap-5"
      >
        <TextAnswer question={question} question_no={question_no} form_id={form_id} setLoading={setLoading} setError={setError} userId={userId} nextQuestionNav={nextQuestionNav} email={email} />
      </div>
    )
  } else {
    return (
      <div
      className="flex flex-col justify-start items-start gap-5"
      >
        <VideoAnswer question={question} question_no={question_no} form_id={form_id} setLoading={setLoading} setError={setError} userId={userId} nextQuestionNav={nextQuestionNav} email={email} />
      </div>
    )
  }


}
