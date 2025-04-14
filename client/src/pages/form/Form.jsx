import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { supabase } from "../../createClient";
import useFetch from "../../customHooks/useFetch";

export const Form = () => {
    const params = useParams();
    const [form, setForm] = useState();
    const { result, loading, error } = useFetch(() =>
        supabase.from("Form").select("*").eq(`id`, params.formId)
        , []
    );

    if (loading) {
        return (
            <div>
                <h1>LOADING...</h1>
            </div>
        );
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
        <div className="px-10 py-10 ">
            {data.map(({ description, due_date, id, post_date, title }) => (
                <div key={id} className="flex flex-col gap-1">
                    <h1 className="text-5xl font-bold pb-2">{title}</h1>
                    <span className="text-md font-medium">
                        Post date: {post_date}
                    </span>
                    <span className="text-md font-medium">
                        Due date: {due_date}
                    </span>
                    <p className="text-lg">{description}</p>
                    <NavLink
                        className="border-[1px] w-fit px-4 py-1 font-medium mt-3 hover:cursor-pointer"
                        to={"question/1"}
                    >
                        Apply
                    </NavLink>
                </div>
            ))}
        </div>
    );
};
