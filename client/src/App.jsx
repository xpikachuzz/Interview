import { use, useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./createClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Route, Routes } from "react-router-dom";
import { Question } from "./pages/Question";
import { Home } from "./pages/Home";
import { Recruiter } from "./pages/Recruiter";
import { Form } from "./pages/form/Form";
import { Submit } from "./pages/form/Submit";

function App() {
    const [userId, setUserId] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            setLoading(true);
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user != null) {
                setIsLoggedIn(true);
                setUserId(user.id);
            } else {
                setIsLoggedIn(false);
                setUserId("");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const signout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setLoading(false);
    };

    if (loading) {
        return <h1>LOADING</h1>;
    }

    if (!isLoggedIn) {
        return (
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
            />
        );
    }

    return (
        <div className="flex justify-center items-center">
            <Routes>
                <Route path="/" element={<Home />}></Route>
                {/* Each recruiter has a unique profile */}
                <Route path="recruiter/:id">
                    <Route path="" element={<Recruiter />}></Route>
                    {/* Form */}
                    <Route path="form/:formId">
                        <Route path="" element={<Form />}></Route>
                        <Route
                            path="question/:id"
                            element={<Question />}
                        ></Route>
                        <Route path="submit" element={<Submit />}></Route>
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
