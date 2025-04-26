import React, { useEffect, useState } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import useFetch from "../../customHooks/useFetch";
import { supabase } from "../../createClient";
import { Loading } from './../../element/Loading';

export const Recruiter = ({userId}) => {
    const {id} = useParams();   // recruiter id
    const isMyProfile = parseInt(id) == parseInt(userId)
    const [isEditing, setIsEditing] = useState({
        company_name: false,
        description: false
    })

    const {loading, result, error, setResult, setError, setLoading} = useFetch(
        () =>
            supabase
                .from('Recruiter')
                .select(`
                    *,
                    Form (
                        *
                    )
                `)
                .eq('id', id) // recruiterId is the one you're querying
                .single(), // Since you want only one recruiter
        [id]
    );

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

    function toggleEditing(toggleEditLabel) {
        setIsEditing(currEditPerms => ({
            ...currEditPerms,
            [toggleEditLabel]: !currEditPerms[toggleEditLabel]
        }))
    }

    async function submit(editLabel) {
        // Stop editing
        toggleEditing(editLabel)
        // submit it
        try {
            // submit the editLabel
            setLoading("submitting...")
            const res = await supabase
                .from('Recruiter')
                .update({ [editLabel]: result.data[editLabel] })
                .match({ id: id })
            
                if (res.error) {
                    setError(res.error.message)
                }
        } catch (e) {
            setError(e)
        }
        // clean up - stop loading
        setLoading()
    }

    function handleChange(editLabel, e) {
        setResult(res => ({
            ...res,
            data: {
                ...res.data,
                [editLabel]: e.target.value
            }
        }))
    }

    return (
        <div className="flex flex-col gap-10 w-full px-10 bg-blue-950">
            <div key={result.data.company_name} className="flex flex-col justify-center gap-5 w-full">
                <div className="flex gap-4 mt-40">
                    {
                        (!isEditing.company_name) ? (
                            <h1 className="text-7xl max-lg:text-5xl text-center text-wrap break-normal font-extrabold text-slate-100 px-10">{result.data.company_name}</h1>
                        ) : (
                            <input id="comapny_name" className="text-4xl text-center w-full rounded-md p-1.5 border-[0.5px] bg-slate-100 focus" value={result.data.company_name} onChange={(e) => handleChange("company_name", e)} />
                        )
                    }
                    
                    {
                        // if not editing description and is my profile
                        // (!isEditing.description && isMyProfile) ? (
                        //     // is editing title
                        //     (isEditing.company_name) ? (
                        //         <button onClick={() => submit("company_name")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer">Done ✅</button>
                        //     ) : (
                        //         <button onClick={() => toggleEditing("company_name")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer">Edit ✏️</button>
                        //     )
                        // ) : <></>
                    }
                </div>
                <div className="flex max-sm:flex-col max-sm:gap-6 items-center justify-between text-2xl font-semibold text-slate-200 gap-4">
                    {
                        (!isEditing.description) ? (
                            <p className="break-normal w-full text-center">{result.data.description}</p>
                        ) : (
                            <textarea className="resize-y bg-blue-800 h-full text-wrap rounded-md p-1.5 w-full border-[0.5px] border-slate-950" value={result.data.description} onChange={(e) => handleChange("description", e)} />
                        )
                    }
                    {
                        // if not editing title and is my profile
                        (!isEditing.company_name && isMyProfile) ? (
                            // is editing title
                            (isEditing.description) ? (
                                <button onClick={() => submit("description")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer text-xl">Done ✅</button>
                            ) : (
                                <button onClick={() => toggleEditing("description")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer text-xl">Edit ✏️</button>
                            )
                        ) : <></>
                    }
                </div>
            </div>
            <div className="flex flex-col gap-10 mt-34 font-semibold text-slate-100">
                <div className="flex max-sm:flex-col max-sm:gap-6 justify-between items-center ">
                    <h1 className="text-5xl font-extrabold">Company's Jobs</h1>
                    { isMyProfile && <NavLink className="border-[1px] px-2 py-1 rounded-md hover:cursor-pointer text-center" to={"create_form"}>Create new</NavLink>}
                </div>
                {
                    result.data.Form.map(
                        ({id, title, due_date}) => (
                            <NavLink 
                                to={`form/${id}`}
                                className="flex justify-between items-center border-y-[1px] px-8 py-2 hover:cursor-pointer" 
                                key={id}
                            >
                                <h1 className="text-3xl font-bold">{title}</h1>
                                <p className="font-semibold">{due_date}</p>
                            </NavLink>
                        )
                    )
                }
            </div>
        </div>
    )
};
