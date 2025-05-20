import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./MyExhibitions.css"
import logo from '../logo.png'

const MyExhibitions = () => {
    const navigate = useNavigate();
    const [exhibitions, setExhibitions] = React.useState([]);
    const formData = new FormData();
    formData.append('organizerID', sessionStorage.getItem('accountID'));


    function handleRemove(id) {
    
        fetch('/api/deleteExhibition', {
            method: 'POST',
            body: JSON.stringify({ exhibitionID: id }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Delete response:', data); 
                if (data.success) {
                    const newExhibitions = exhibitions.filter((item) => item.id !== id);
                    setExhibitions(newExhibitions);
                } else {
                    console.error('Failed to delete exhibition:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function handleEdit(exhibition) {
        navigate('/editArt', { state: { exhibition } });
    }

    React.useEffect(() => {
        fetch('/api/getExhibitions', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setExhibitions(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    , []);
        
    return (
        <div className="MyExhibitions">
            <div className="MyExhibitionsHeader">
                <img style={{width: '10vw', height: '10vw', cursor: 'pointer'}} src={logo} alt="Logo" onClick={() => navigate('/browse')} />
                <h1 style={{'user-select': 'none'}}>My Exhibitions</h1>
                <button onClick={() => navigate('/exhibitionCreation')} className="ExhibitButton">Create Exhibition</button>
                <div className="ExhibitionList">
                    {/* This is where the exhibitions will be displayed */}
                    {exhibitions.map(exhibition => (
                        <div key={exhibition.id} className="ExhibitionItem" onClick={() => {
                            sessionStorage.setItem('role', 'manager');
                            sessionStorage.setItem('exhibitID', exhibition.id);
                            sessionStorage.setItem('exhibitName', exhibition.name);
                            sessionStorage.setItem('exhibitLocation', exhibition.location);
                            sessionStorage.setItem('exhibitStartDate', exhibition.startDate);
                            sessionStorage.setItem('exhibitEndDate', exhibition.endDate);
                            sessionStorage.setItem('exhibitStartTime', exhibition.startTime);
                            sessionStorage.setItem('exhibitEndTime', exhibition.endTime);
                            navigate('/exhibition');
                          }}>
                            <h2 className="exhibitionTitle" onClick={() => {
                                sessionStorage.setItem('role', 'manager')
                                sessionStorage.setItem('exhibitID', exhibition.id)
                                sessionStorage.setItem('exhibitName', exhibition.name);
                                sessionStorage.setItem('exhibitLocation', exhibition.location);
                                sessionStorage.setItem('exhibitStartDate', exhibition.startDate);
                                sessionStorage.setItem('exhibitEndDate', exhibition.endDate);
                                sessionStorage.setItem('exhibitStartTime', exhibition.startTime);
                                sessionStorage.setItem('exhibitEndTime', exhibition.endTime);
                                navigate('/exhibition')
                            }} style={{cursor: 'pointer'}}>{exhibition.name}</h2>
                            
                            <div className="exhibitionButtons">
                                <button className="genericButton" type="button" onClick={(e) =>  {
                                    e.stopPropagation();
                                        handleRemove(exhibition.id)
                                    }}>
                                    Delete
                                </button>

                                <button className="genericButton" type="button" onClick={(e) =>  {
                                    e.stopPropagation();
                                        handleEdit(exhibition)
                                    }}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyExhibitions;