import React, { useEffect, useRef, useState } from "react";
import useFetch from "../../customHooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../createClient";
import { AnswerForm } from "./question/AnswerForm";
import { Loading } from "../../element/Loading";

export const Question = ({ id, email }) => {
    const { formId, questionId } = useParams();
    const navigate = useNavigate();

    const { result, error, loading, setLoading, setError } = useFetch(
        () =>
            supabase
                .from("Question")
                .select("*")
                .eq(`question_no`, questionId)
                .eq("form_id", formId),
        [questionId, formId]
    );

    useEffect(() => {
        const check = async () => {
            // Check user has submitted answer for previous question
            try {
                // check which question is the latest answer
                let res = (
                    await supabase
                        .from("Answer")
                        .select("*")
                        .eq("form_id", formId)
                        .eq("user_id", id)
                        .order("question_no", { ascending: false })
                        .limit(1)
                )

                // if hasn't been answered then
                if (res.data.length == 0) {
                    // must be on the first question
                    if (questionId != "1") {
                        navigate("../question/1");
                    }
                    return;
                } else {
                    // check how many questions
                    const resQuestion = await supabase
                        .from("Question")
                        .select("question_no")
                        .eq("form_id", formId)
                        .order("question_no", { ascending: false })
                        .limit(1);

                    // check for error
                    if (resQuestion.error) {
                        setError(resQuestion.error.message)
                        return
                    }

                    // defining variables
                    const lastQuestion = resQuestion.data[0].question_no
                    const latestAnsweredQuestion = res.data[0].question_no;
                    const toAnswerQuestion = latestAnsweredQuestion + 1;
                    
                    // check if all questions answered
                    if (latestAnsweredQuestion == lastQuestion) {
                        navigate("../submit")
                        return
                    }

                    // check if on the latest question or not a valid question id
                    if (questionId != toAnswerQuestion || questionId > lastQuestion) {
                        navigate("../question/" + toAnswerQuestion);
                    }
                    setLoading(false)
                }
            } catch (e) {
                console.log(e)
                setError(e);
            }
        };

        setLoading(true)
        check();
    }, [questionId, formId]);



    if (loading) {
        return <Loading />
    }

    if (error || result.error) {
        return (
            <h1 className="text-3xl font-bold text-center">
                {error.message || result.error.message}
            </h1>
        );
    }

    const { data } = result;

    async function nextQuestionNav () {
        const nextQuestionid = parseInt(questionId) + 1;
        // check if there is a next question
        const nextResult = await supabase
            .from("Question")
            .select("*")
            .eq("question_no", nextQuestionid)
            .eq("form_id", formId);
    
        if (nextResult.error) {
            setError(
                "Can't check if there is a next question. Try again later."
            );
            setLoading(false)
            return;
        }
    
        // if there is a next question then redirect
        if (nextResult.data.length != 0) {
            navigate("../question/" + nextQuestionid);
        }
    
        // if there isn't then show finished page
        if (nextResult.data.length == 0) {
            navigate("../submit");
        }
        setLoading(false)
    }


    return (
        <div className="px-10 pt-40 w-screen flex items-center justify-center">
            {
                data.map(({ question, question_no, type, form_id }) => (
                    <AnswerForm 
                        key={questionId}
                        question={question} 
                        question_no={question_no} 
                        type={type} 
                        form_id={form_id} 
                        questionId={questionId} 
                        setLoading={setLoading}
                        setError={setError}
                        userId={id}
                        nextQuestionNav={nextQuestionNav}
                        email={email}
                    />
                ))
            }
        </div>
    );
};
