import React, { useEffect, useState } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import useFetch from "../customHooks/useFetch";
import { supabase } from "../createClient";

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
        return <h1 className="text-3xl font-bold text-center">Loading...</h1>;
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
        <div className="p-12 flex flex-col gap-10 w-screen">
            <div key={result.data.company_name} className="flex flex-col gap-5 w-full">
                <div className="flex items-center justify-between gap-4">
                    {
                        (!isEditing.company_name) ? (
                            <h1 className="text-3xl break-normal font-bold">{result.data.company_name}</h1>
                        ) : (
                            <input id="comapny_name" className="w-full rounded-md p-1.5 border-[0.5px] bg-slate-100 focus" value={result.data.company_name} onChange={(e) => handleChange("company_name", e)} />
                        )
                    }
                    
                    {
                        // if not editing description and is my profile
                        (!isEditing.description && isMyProfile) ? (
                            // is editing title
                            (isEditing.company_name) ? (
                                <button onClick={() => submit("company_name")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer">Done ✅</button>
                            ) : (
                                <button onClick={() => toggleEditing("company_name")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer">Edit ✏️</button>
                            )
                        ) : <></>
                    }
                </div>
                <div className="flex items-center justify-between gap-4">
                    {
                        (!isEditing.description) ? (
                            <p className="break-normal w-full">{result.data.description}</p>
                        ) : (
                            <textarea className="resize-y h-full text-wrap rounded-md p-1.5 w-full border-[0.5px] bg-gray-100" value={result.data.description} onChange={(e) => handleChange("description", e)} />
                        )
                    }
                    {
                        // if not editing title and is my profile
                        (!isEditing.company_name && isMyProfile) ? (
                            // is editing title
                            (isEditing.description) ? (
                                <button onClick={() => submit("description")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer">Done ✅</button>
                            ) : (
                                <button onClick={() => toggleEditing("description")} className="border-[1px] px-2 py-1 rounded-md whitespace-nowrap hover:cursor-pointer">Edit ✏️</button>
                            )
                        ) : <></>
                    }
                </div>
            </div>
            <div className="flex flex-col gap-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Company's Jobs</h1>
                    { isMyProfile && <NavLink className="border-[1px] px-2 py-1 rounded-md hover:cursor-pointer" to={"create_form"}>Create new</NavLink>}
                </div>
                {
                    result.data.Form.map(
                        ({id, title, due_date}) => (
                            <NavLink 
                                to={`form/${id}`}
                                className="flex justify-between items-center border-[1px] px-4 py-2 rounded-md hover:cursor-pointer" 
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
