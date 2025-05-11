import React from "react"
import './App.css'
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ImageUploadP from "./pages/UploadArt"
import Hub from "./pages/Hub"
import MyExhibitions from "./pages/MyExhibitions"
import Exhibition from "./pages/Exhibition"
import ExhibitionCreation from "./pages/ExhibitionCreation"
import EditArt from "./pages/EditArt"
import Browse from "./pages/Browse"
import Calendar from "./pages/Calendar"
import AframeScene from "./pages/AFrame3DScene"
import AFrameARScene from "./pages/AFrameARScene"
import TicketList from "./pages/TicketList"


import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/upload" element={<ImageUploadP />}/> 
                    <Route path="/hub" element={<Hub />}/>
                    <Route path="/exhibitionCreation" element={<ExhibitionCreation />}/>
                    <Route path="/myExhibitions" element={<MyExhibitions />}/>
                    <Route path="/exhibition" element={<Exhibition />}/>
                    <Route path="/editArt" element={<EditArt />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/calendar" element={<Calendar startingDate={new Date()} />} />
                    <Route path="/3dscene" element={<AframeScene />} />
                    <Route path="/ARscene" element={<AFrameARScene />} />
                    <Route path="/ticketList" element={<TicketList />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
