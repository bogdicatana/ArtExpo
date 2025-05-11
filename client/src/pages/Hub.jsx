import React from "react"
import "./Hub.css"
import { useNavigate } from "react-router-dom"
import logo from "../logo.png"
import viewExhibitions from "../viewExhibitions.png"
import manageExhibitions from "../manageExhibitions.png"

const Home = () => {
    const navigate = useNavigate()
    return (
        <div className="HubPage">
            <img src={logo} className="AppLogoHub"></img>
            <div className="buttonRow"> 
                <button onClick={() => navigate('/browse')} className="hubButton" style={{backgroundImage: `url(${viewExhibitions})`}}>Browse Exhibitions</button>
                <button onClick={() => navigate('/myExhibitions')} className="hubButton" style={{backgroundImage: `url(${manageExhibitions})`}}>Manage Exhibitions</button>
            </div>
        </div>
    )
}
export default Home