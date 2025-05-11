import React, {useState} from "react"
import './Signup.css'
import logo from "../logo.png"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const sendSignUp = () => {
        if (password !== passwordConfirm) {
            alert("Passwords do not match")
            setPassword('')
            setPasswordConfirm('')
            return
        }

        if(password === '' || username === '' || email === '' || passwordConfirm === ''){
            alert("Empty field")
            setPassword('')
            setPasswordConfirm('')
            setUsername('')
            setEmail('')
            return
        }

        const data = {
            username: username,
            email: email,
            password: password,
        }

        // Send the POST request using fetch
        fetch('/signup', {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json', // Content type header
            },
            body: JSON.stringify(data), // Convert JS object to JSON string
        })
            .then(response => response.json()) // Parse JSON response from the server
            .then(data => {
                if(data.message === "email"){
                    alert("Email already has an account associated with it")
                    setEmail('')
                } else if(data.message === "username"){
                    alert("Username already exists")
                    setUsername('')
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
        <div className="SignUpPage">
            <div className="SignUp">
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
                        Email:
                        <br/>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                <div>
                    <label>
                        Confirm Password:
                        <br/>
                        <input
                            type="text"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            className="textBox"
                        />
                    </label>
                </div>
                  <button onClick={sendSignUp} className="genericButton">Sign Up</button>
            </div>
        </div>
    )
}

export default Signup