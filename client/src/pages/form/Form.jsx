import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../createClient";
import useFetch from "../../customHooks/useFetch";

export const Form = () => {
    const params = useParams();
    const [form, setForm] = useState();
    const { result, loading, error } = useFetch(() =>
        supabase.from("Form").select("*").eq(`id`, params.formId)
    );

    // useEffect(() => {
    //     fetchUsers();
    // }, []);

    // async function fetchUsers() {
    //     const { data } = await supabase
    //         .from("Form")
    //         .select("*")
    //         .eq(`id`, params.formId);
    //     setForm(data);
    //     console.log("DATA: ", data);
    // }

    if (loading) {
        return (
            <div>
                <h1>LOADING...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>ERROR: {error}</h1>
            </div>
        );
    }

    const { data } = result;
    console.log(data);

    return (
        <div>
            <h1></h1>
        </div>
    );
};
