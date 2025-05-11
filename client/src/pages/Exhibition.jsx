import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Exhibition.css';

const Exhibition = () => {
    const navigate = useNavigate();
    const [artworks, setArtworks] = React.useState([]);
    const [disableTicket, setDisableTicket] = React.useState(false);

    React.useEffect(() => {
        const formData = new FormData();
        formData.append('exhibitID', sessionStorage.getItem('exhibitID'));
        fetch('/getArtworks', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setArtworks(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    React.useEffect(() => {
        const formData = new FormData();
        formData.append('exhibitID', sessionStorage.getItem('exhibitID'));
        formData.append('accountID', sessionStorage.getItem('accountID'));
        fetch('/checkTicket', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message === 'ticket') {
                    setDisableTicket(true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })

    const handleTicketPurchase = () => {
        const formData = new FormData();
        formData.append('accountID', sessionStorage.getItem('accountID'));
        formData.append('exhibitID', sessionStorage.getItem('exhibitID'));
        fetch('/uploadTicket', {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message === 'success') {
                    setDisableTicket(true);
                } else {
                    alert('Ticket purchase failed. Please try again.');
                }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        
    }

    return (
        <div className='ExhibitionPage'>
            <div className='ExhibitionContent'>
                <h1>{sessionStorage.getItem('exhibitName')}</h1>
                <div className='ExhibitionActions' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className='ExhibitionInfoDiv' style={{marginRight: '10vw'}}>
                        <h2>Location: {sessionStorage.getItem('exhibitLocation')}</h2>
                        <h2>Dates: {sessionStorage.getItem('exhibitStartDate')} to {sessionStorage.getItem('exhibitEndDate')}</h2>
                        <h2>Times: {sessionStorage.getItem('exhibitStartTime')} - {sessionStorage.getItem('exhibitEndTime')}</h2>
                    </div>

                    <div className='ExhibitionButtons' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                        className='genericButton' 
                        onClick={() => handleTicketPurchase()} 
                        style={{ backgroundColor: disableTicket ? 'grey' : '' }}
                        disabled={disableTicket}
                    >
                        {!disableTicket ? 'Get Ticket' : 'Ticket Purchased'}
                    </button>
                    <br></br>
                    <button className='genericButton' onClick={() => navigate('/3dscene')}>3D Scene</button>
                    <br></br>
                    <button className='cancelButton' onClick={() => {
                        if (sessionStorage.getItem('role') === 'manager') {
                            navigate('/myExhibitions');
                        }else if (sessionStorage.getItem('role') === 'visitorTicket') {
                            navigate('/ticketList');
                        }else {
                            navigate('/browse');
                        }
                    }}>Go back</button>
                    </div>
                    </div>
                <div className="ArtworkList">
                    {/* This is where the exhibitions will be displayed */}
                    {artworks.map(artwork => (
                        <div key={artwork.imageID} className="ArtworkItem">
                            {artwork.title}
                            <br></br>
                            <button className='genericButton' onClick={() => {
                                sessionStorage.setItem('artworkPath', artwork.imageFilePath);
                                sessionStorage.setItem('artworkAspectRatio', artwork.aspectRatio);
                                navigate('/ARscene');
                            }
                            }>AR Scene</button>
                            <br></br>
                            <img className='imageArt' src={artwork.imageFilePath} alt={artwork.title} />
                            <br></br>
                            {`Artist: ${artwork.artist}`}
                            <br></br>
                            {`Medium: ${artwork.medium}`}
                            <br></br>
                            {`Year: ${artwork.year}`}
                            <br></br>
                            <div dangerouslySetInnerHTML={{ __html: artwork.description }} />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Exhibition;