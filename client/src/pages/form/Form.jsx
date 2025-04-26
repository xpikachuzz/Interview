import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { supabase } from "../../createClient";
import useFetch from "../../customHooks/useFetch";
import { Loading } from "../../element/Loading";
import { Countdown } from "../../element/Countdown";

export const Form = ({userId}) => {
    const params = useParams();
    const [form, setForm] = useState();
    const { result, loading, error } = useFetch(() =>
        supabase.from("Form").select("*").eq(`id`, params.formId)
        , []
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

    const { data } = result;


    return (
        <div className="px-10 py-[170px] max-sm:py-[240px] text-slate-100">
            {data.map(({ description, due_date, id, post_date, title }) => (
                <div key={id} className="flex flex-col gap-1">
                    <h1 className="text-5xl font-extrabold pb-2">{title}</h1>
                    <span className="text-md font-medium">
                        Post date: {post_date}
                    </span>
                    <span className="text-md font-medium">
                        Due date: {due_date}
                    </span>
                    <p className="text-lg">{description}</p>
                    <div className="flex gap-5 justify-center items-center">
                        <NavLink
                            className="border-[1px] w-fit px-4 py-1 font-medium mt-3 hover:cursor-pointer"
                            to={"question/1"}
                        >
                            Apply
                        </NavLink>
                        
                        {
                            (params.id == userId) &&
                                <NavLink
                                    className="border-[1px] w-fit px-4 py-1 font-medium mt-3 hover:cursor-pointer"
                                    to={"user"}
                                >
                                    Answers
                                </NavLink>
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};
