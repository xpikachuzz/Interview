import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './../../createClient';


export const FormCreate = ({userId}) => {
  const {id} = useParams()
  const navigate = useNavigate()
  // array of objects. each object represents a question
  const [questions, setQuestions] = useState([{
    id: uuidv4(),
    question: "Type your question here...",
    type: "text"
  }])
  const [formDetails, setFormDetails] = useState({
    title: "Enter title here",
    description: "Enter description here",
    due_date: "2025-01-01",
  })
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (id != userId) {
      navigate("/")
    }
  }, [id])

  function formDetailChange(lable, e) {
    setFormDetails(formDets => ({
      ...formDets,
      [lable]: e.target.value
    }))
  }

  function onQuestionChange(id, e) {
    setQuestions(queses => queses.map((ques) => ques.id == id ? {...ques, question: e.target.value} : ques))
  }

  function addQuestion(type) {
    setQuestions(queses => [...queses, {
      id: uuidv4(),
      question: "Type your question here...",
      type
      }]
    )
  }
 
  function deleteQuestion(id) {
    setQuestions(queses => queses.filter(ques => ques.id != id))
  }

  async function postForm() {
    setError("")
    // Check if there is atleast 1 question
    if (questions.length == 0) {
      setError("Must have at least one question")
      return
    } else if (!formDetails.title || !formDetails.description) {
      // Check if form's detail isn't empty
      setError("Form's title and description can't be empty")
      return
    }

    // add a form 
    const {error: formError, data: formData} = await supabase
      .from("Form")
      .insert({
        title: formDetails.title,
        description: formDetails.description,
        due_date: formDetails.due_date,
        recruiter_id: userId
      })
      .select("*")

    if (formError) {
      setError(formError.message)
      return
    }

    // add questions
    const numberedQuestions = questions.map((ques, i) => ({form_id: formData[0].id, question_no: i+1, question: ques.question, type: ques.type}))
    const res = await supabase
      .from("Question")
      .insert(numberedQuestions)

    const {error: questionError} = res
    if (questionError) {
      setError(questionError.message)
      return
    }
    navigate(`/recruiter/${id}`)
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 px-10 py-6 bg-blue-100 w-full">
      <div>
        <h1 className='text-5xl font-bold'>Form Details</h1>
        <h1 className='text-3xl font-bold mt-5'>Title</h1>
        <input value={formDetails.title} onChange={(e) => formDetailChange("title", e)} className="p-1.5 border-2 w-full rounded-md"/>
        <h1 className='text-2xl font-bold mt-5'>Description</h1>
        <input value={formDetails.description} onChange={(e) => formDetailChange("description", e)} className="p-1.5 border-2 w-full rounded-md"/>
        <h1 className='text-2xl font-bold mt-5'>Due Date</h1>
        <input value={formDetails.due_date} onChange={(e) => formDetailChange("due_date", e)} type='date' className="p-1.5 border-2 w-full rounded-md"/>
      </div>

      {/* Show questions */}
      {
        questions.map(({id, question, type}) => (
          <div key={id} className="flex justify-between items-center gap-5 w-full rounded-md">
            <label className='whitespace-nowrap font-medium'>Type: {type}</label>
            <input value={question} onChange={(e) => onQuestionChange(id, e)} className="p-1.5 border-2 w-full rounded-md"/>
            <button className='border-[1px] px-2 py-1 rounded-md' onClick={() => deleteQuestion(id)}>TRASH</button>
          </div>
        ))
      }

      {/* Create new question */}
      <div className='flex gap-5'>
        <button onClick={() => addQuestion("text")} className='px-2 py-1 border-[1px] rounded-md w-fit'>Add text Question</button>
        <button onClick={() => addQuestion("video")} className='px-2 py-1 border-[1px] rounded-md w-fit'>Add video Question</button>
      </div>
      <h1 className='text-xl font-semibold text-red-500'>{error}</h1>
      <button onClick={postForm} className='text-2xl font-bold px-2 py-1 border-[2px] rounded-md w-fit'>POST FORM</button>
    </div>
  )
}
