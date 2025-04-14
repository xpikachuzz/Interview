import React, { useEffect, useRef } from "react";
import useFetch from "../../customHooks/useFetch";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../createClient";

export const Question = ({ id }) => {
    const { formId, questionId } = useParams();
    const answerRef = useRef();
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
                const res = await supabase
                    .from("Answer")
                    .select("*")
                    .eq("form_id", formId)
                    .order("question_no", { ascending: false })
                    .limit(1);
                console.log("ALL: ", questionId, formId)
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
                setError(e);
            }
        };

        setLoading(true)
        check();
    }, [questionId, formId]);

    async function submitAnswer() {
        setLoading("Posting answer...");
        // post answer to supaabse
        const result = await supabase.from("Answer").insert({
            question_no: questionId,
            form_id: formId,
            answer: answerRef.current.value,
            user_id: id,
        });

        setLoading();
        if (result.error) {
            setError("Can't send answer to database. Try again later.");
            return;
        }
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
    }

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

    const { data } = result;

    return (
        <div className="px-10 py-10 w-7xl">
            {data.map(({ question }) => (
                <div
                    key={questionId}
                    className="flex flex-col justify-start items-start gap-5"
                >
                    <h1 className="text-5xl font-bold pb-2">{question}</h1>
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
                </div>
            ))}
        </div>
    );
};
