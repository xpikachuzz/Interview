import { useEffect, useRef, useState } from "react";
import "./App.css";
import { supabase } from "./createClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { Recruiter } from "./pages/recruiter/Recruiter";
import { Form } from "./pages/form/Form";
import { Submit } from "./pages/form/Submit";
import { Question } from "./pages/form/Question";
import { FormCreate } from "./pages/form/FormCreate";
import { AnswerOverlay } from "./pages/form/answer/AnswerOverlay";
import { UserAnswer } from "./pages/form/answer/UserAnswer";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Header } from "./element/Header";
import { Loading } from "./element/Loading";


gsap.registerPlugin(Draggable) 

const customTheme = {
    default: {
      colors: {
        brand: 'hsl(153 60.0% 53.0%)',
        brandAccent: 'hsl(154 54.8% 45.1%)',
        brandButtonText: 'white',
        // ..
      },
    },
}  


function App() {
    const [userId, setUserId] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const container = useRef()

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
                setUserId({id: user.id, email: user.email});
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


    if (loading) {
        return <Loading />
    }

    if (!isLoggedIn) {
        return (
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                theme="dark"
            />
        );
    }

    return (
        <div ref={container} className="px-10 flex flex-col justify-center items-center bg-blue-950 mx-auto w-6xl max-xl:w-screen" >
            <Header setIsLoggedIn={setIsLoggedIn} setLoading={setLoading} />
            <div>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    {/* Each recruiter has a unique profile */}
                    <Route path="recruiter/:id">
                        <Route path="" element={<Recruiter userId={userId.id} />}></Route>
                        <Route path="create_form" element={<FormCreate userId={userId.id} />}></Route>
                        {/* Form */}
                        <Route path="form/:formId">
                            <Route path="" element={<Form userId={userId.id} />}></Route>
                            <Route
                                path="question/:questionId"
                                element={<Question id={userId.id} email={userId.email} />}
                            ></Route>
                            <Route path="user" element={<AnswerOverlay userId={userId.id} /> } >
                                <Route path=":userId" element={<UserAnswer userId={userId.id} />}></Route>
                            </Route>
                            <Route path="submit" element={<Submit />}></Route>
                        </Route>
                    </Route>
                </Routes>
            </div>
        </div>
    );
}

export default App;
