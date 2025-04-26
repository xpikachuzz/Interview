import React, { useEffect, useState } from 'react'
import { supabase } from '../createClient';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

export const Header = ({setIsLoggedIn, setLoading}) => {
  const [headerShow, setHeaderShow] = useState(false);
  const {contextSafe} = useGSAP()

  useGSAP(
    () => {
        gsap.to('#inner-header', {
          backgroundColor: "#e5e7eb40",
          boxShadow: "0px 0px 0px 0px #00000020",
          y: 30,
          duration: 0.1
        })
    }, {  }
  )


  const onHeaderHide = contextSafe((e)=> {
      // change background, slowly scale and remove shadow
      gsap.to('#inner-header', {
          backgroundColor: "#e5e7eb40",
          boxShadow: "0px 0px 0px 0px #00000020",
          y: 30
      })
  })

  const onHeaderShow = contextSafe((e)=> {
      // change background, slowly scale and add shadow
      gsap.to('#inner-header', {
          backgroundColor: "#ffffff",
          boxShadow: "5px 5px 5px 5px #00000040",
          y: 0
      })
  })

  useEffect(() => {
    // Scrolling window
    function scrollHeader(e) {
        if (window.scrollY > 100 && !headerShow) {
            setHeaderShow(true)
            onHeaderShow(e)
        } else if (window.scrollY <= 100 && headerShow) {
            setHeaderShow(false)
            onHeaderHide(e)
        }
    }

    window.addEventListener("scroll", scrollHeader)
    return () => window.removeEventListener("scroll", scrollHeader);
  }, [headerShow, onHeaderHide, onHeaderShow])

  
  const signout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setLoading(false);
  };

  return (
    <header id="header" className="header2 px-10 flex gap-10 w-full justify-between items-center fixed z-40 top-0 py-5">
        <div id="inner-header" className="inner-header px-10 py-2 flex gap-20 max-sm:gap-10 max-sm:flex-wrap max-sm:justify-center items-center flex-wrap text-xl bg-gray-200/40 w-4/5 font-medium font-mono border-[0.25px] rounded-xl  ">
            <Link className="flex-grow font-extrabold text-shadow-lg text-shadow-black/10 text-yellow-700 text-2xl items-center" to={"/"}>Home</Link>
            <Link className="flex-grow font-extrabold text-shadow-lg text-shadow-black/10 text-yellow-700 text-2xl items-center" to={"/"}>Home</Link>
            <Link className="flex-grow font-extrabold text-shadow-lg text-shadow-black/10 text-yellow-700 text-2xl items-center" to={"/"}>Home</Link>
            <button className="hover:cursor-pointer text-shadow-lg text-shadow-black/10 text-yellow-700 text-2xl font-extrabold items-center" onClick={signout}>Logout</button>
        </div>
        <img src="https://assurancevisiteurs.ca/wp-content/uploads/2023/10/assurance-visiteurs-logo.svg"></img>
    </header>
  )
}
