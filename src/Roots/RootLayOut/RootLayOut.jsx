import { NavLink, Outlet } from "react-router-dom"
import "./RootLayOut.scss"


import { useState, useEffect } from "react"

const RootLayOut = () => {

     const [isfixed, setIsfixed] = useState(false)

  useEffect(() => {
    const handelScrol = () => {
      if(window.scrollY > 50){
        setIsfixed(true)
      }else{
        setIsfixed(false)
      }
    }
    window.addEventListener("scroll", handelScrol)
    return () => window.removeEventListener("scroll", handelScrol)
  }, [])



  return (
    <div className="rootLayOut">
        <h1 className="rootLayOut-title">Aka market 5</h1>
        <div className="rootLayOut-sides">


            <div className= {`rootLayOut-sides-up ${ isfixed ? "fixed" : ""} `}>
                <nav>
                    <NavLink className="btn" to="/TotalBase" >baza</NavLink>
                    
                    <NavLink className="btn" to="/" >kunlik savdo</NavLink>
                    <NavLink className="btn" to="/Xisobotlar" >xisobotlar</NavLink>
                </nav>
            </div>



            <div className="rootLayOut-sides-down">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default RootLayOut