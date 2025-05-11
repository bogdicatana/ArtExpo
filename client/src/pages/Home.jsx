import React from "react"
import "./Home.css"
import { useNavigate } from "react-router-dom"
import logo from "../logo.png"

const Home = () => {
    const navigate = useNavigate()
    return (
        <div className="HomePage">
            <div className="HomePageBackground">
                <img src={logo} className="AppLogoHome"></img>
                <h1>Welcome to the Artwork Exhibition!</h1>
                <div className="authButtons">
                    <button onClick={() => navigate('/login')} className="genericButton">Log In</button>
                    <br></br>
                    <button onClick={() => navigate('/signup')} className= "genericButton">Sign Up</button>
                </div>
            </div>
        </div>
    )
}
export default Home