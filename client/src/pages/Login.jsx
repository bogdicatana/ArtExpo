import React, {useState} from "react"
import './Login.css'
import logo from "../logo.png"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const sendLogIn = () => {
        const data = {
            username: username,
            password: password
        }

        // Send the POST request using fetch
        fetch('/api/login', {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json', // Content type header
            },
            body: JSON.stringify(data), // Convert JS object to JSON string
        })
            .then(response => response.json()) // Parse JSON response from the server
            .then(data => {
                if(data.message === "failed login"){
                    alert("Login failed")
                    setUsername('')
                    setPassword('')
                }else{
                    sessionStorage.setItem('accountName', username)
                    sessionStorage.setItem('accountID', data.accountID)
                    navigate('/hub')
                }
                console.log('Response from server:', data.message)
            })
            .catch(error => {
                console.error('Error:', error)
            })
    }

    return (
        <div className="LogInPage">
            <div className="LogIn">
                <img onClick={() => navigate('/')} src={logo} className="AppLogo" alt="logo" />
                <div>
                    <label>
                        Username:
                        <br/>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="textBox"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <br/>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="textBox"
                        />
                    </label>
                </div>
                <button onClick={sendLogIn} className="genericButton">Log In</button>
            </div>
        </div>
    )
}

export default Signup