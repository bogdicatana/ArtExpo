import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import "./ExhibitionCreation.css"
import logo from "../logo.png"

const ExhibitionCreation = () => {
    const navigate = useNavigate()

    const [exhibitionName, setExhibitionName] = useState("")
    const [exhibitionLocation, setExhibitionLocation] = useState("")
    const [exhibitionStartDate, setExhibitionStartDate] = useState("")
    const [exhibitionEndDate, setExhibitionEndDate] = useState("")
    const [exhibitionStartTime, setExhibitionStartTime] = useState("")
    const [exhibitionEndTime, setExhibitionEndTime] = useState("")

    const sendExhibitionData = () => {
        const data = {
            exhibitionName: exhibitionName,
            exhibitionLocation: exhibitionLocation,
            exhibitionStartDate: exhibitionStartDate,
            exhibitionEndDate: exhibitionEndDate,
            organizerID: sessionStorage.getItem('accountID'),
            exhibitionStartTime: exhibitionStartTime,
            exhibitionEndTime: exhibitionEndTime
        }

        fetch('/exhibitionCreation', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if(data.message === "Exhibition name already exists"){
                    alert("Exhibition name already exists")
                    setExhibitionName('')
                } else if(data.message === "Internal server error"){
                    alert("Internal Server Error")
                }else{
                    sessionStorage.setItem('exhibitID', data.exhibitID)
                    sessionStorage.setItem('role', 'manager')
                    navigate('/editArt')
                }
                console.log('Response from server:', data.message)
            })
            .catch(error => {
                console.error('Error:', error)
            })
    }

    return(
        <div className="ExhibitionCreation">
            <div className="ExhibitionCreationForm">
                <img src={logo} className="AppLogoExhibitionCreation"></img>
                <label>
                    Exhibition name:
                    <br/>
                    <input
                        type="text"
                        value={exhibitionName}
                        onChange={(e) => setExhibitionName(e.target.value)}
                        className="textBox"
                    />
                </label>
                <label>
                    Exhibition location:
                    <br/>
                    <input
                        type="text"
                        value={exhibitionLocation}
                        onChange={(e) => setExhibitionLocation(e.target.value)}
                        className="textBox"
                    />
                </label>
                <label>
                    Start date:
                    <br/>
                    <input
                        type="date"
                        value={exhibitionStartDate}
                        onChange={(e) => setExhibitionStartDate(e.target.value)}
                        className="textBox"
                    />
                </label>
                <label>
                    End date:
                    <br/>
                    <input
                        type="date"
                        value={exhibitionEndDate}
                        onChange={(e) => setExhibitionEndDate(e.target.value)}
                        className="textBox"
                    />
                </label>
                <label>
                    Start time:
                    <br/>
                    <input
                        type="time"
                        value={exhibitionStartTime}
                        onChange={(e) => setExhibitionStartTime(e.target.value)}
                        className="textBox"
                    />
                </label>
                <label>
                    End time:
                    <br/>
                    <input
                        type="time"
                        value={exhibitionEndTime}
                        onChange={(e) => setExhibitionEndTime(e.target.value)}
                        className="textBox"
                    />
                </label>
                <div style={{gap: '10px', display: 'flex', justifyContent: 'center'}}>
                    <button className="cancelButton" onClick={() => navigate('/myExhibitions')}>Cancel</button>
                    <button className="genericButton" onClick={sendExhibitionData}>Create Exhibition</button>
                </div>
            </div>
        </div>
    )
}

export default ExhibitionCreation