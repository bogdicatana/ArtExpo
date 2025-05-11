import React, { useEffect } from 'react'
import 'aframe'
import { useNavigate } from 'react-router-dom'

const AframeScene = () => {
    const navigate = useNavigate()
    const [artworks, setArtworks] = React.useState([])
    const formData = new FormData()
    formData.append('exhibitID', sessionStorage.getItem('exhibitID'))

    useEffect(() => {
        fetch('/getArtworks', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setArtworks(data)
            })
            .catch(error => {
                console.error('Error:', error)
            });
    }, [formData]);

    const renderTunnelModules = () => {
        const modules = [];
        for (let i = 0; i < artworks.length; i += 2) {
            const image1 = artworks[i] ? artworks[i].imageFilePath : ''
            const aspectRatio1 = artworks[i] ? artworks[i].aspectRatio : 1
            const image2 = artworks[i + 1] ? artworks[i + 1].imageFilePath : ''
            const aspectRatio2 = artworks[i + 1] ? artworks[i + 1].aspectRatio : 1
            modules.push(
                <a-entity key={i}>
                    <a-image
                        src={image1}
                        position={`-1.99 2 ${-i * 5}`}
                        rotation="0 90 0"
                        width={2}
                        height={2 / aspectRatio1}
                    ></a-image>
                    {artworks[i] && (
                        <a-text
                            value={`Title: ${artworks[i].title}\nArtist: ${artworks[i].artist}\nMedium: ${artworks[i].medium}\nYear: ${artworks[i].year}`}
                            position={`-1.99 2 ${-i * 5 - 1}`}
                            rotation="0 90 0"
                            align="left"
                            color="black"
                            width="4"
                        ></a-text>
                    )}
                    <a-image
                        src={image2}
                        position={`1.99 2 ${-i * 5}`}
                        rotation="0 -90 0"
                        width={2}
                        height={2 / aspectRatio2}
                    ></a-image>
                    {artworks[i + 1] && (
                        <a-text
                            value={`Title: ${artworks[i + 1].title}\nArtist: ${artworks[i + 1].artist}\nMedium: ${artworks[i + 1].medium}\nYear: ${artworks[i + 1].year}`}
                            position={`1.99 2 ${-i * 5 + 1}`}
                            rotation="0 -90 0"
                            align="left"
                            color="black"
                            width="4"
                        ></a-text>
                    )}
                    <a-plane material="shader: flat" position={`0 4 ${-i * 5}`} rotation="90 0 90" width="10" height="4" color="#7BC8A4"></a-plane>
                    <a-plane material="shader: flat" position={`2 2 ${-i * 5}`} rotation="0 -90 0" width="10" height="4" color="white"></a-plane>
                    <a-plane material="shader: flat" position={`-2 2 ${-i * 5}`} rotation="0 90 0" width="10" height="4" color="white"></a-plane>
                    <a-plane material="shader: flat" position={`0 0 ${-i * 5}`} rotation="-90 90 0" width="10" height="4" color="#7BC8A4"></a-plane>
                </a-entity>
            );
        }
        return modules;
    };

    return (
        <body>
            <div className='ExitButton' style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                <button className='cancelButton' onClick={() => navigate('/exhibition')}>Exit</button>
            </div>
            <a-scene>
                <a-camera position="0 2 0" rotation="0 0 0">
                </a-camera>
                {renderTunnelModules()}
                <a-sky color="#ECECEC"></a-sky>
            </a-scene>
        </body>
    );
};

export default AframeScene;