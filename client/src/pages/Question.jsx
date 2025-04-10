import React from 'react'
import { useParams } from 'react-router';

export const Question = () => {
  const {id} = useParams()
  return (
    <div>Question</div>
  )
}
