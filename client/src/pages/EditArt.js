import React, { useState, createRef, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './EditArt.css';


function EditArt() {
    const navigate = useNavigate();

    const [description, setDescription] = useState('')
    
    const [artworks, setArtworks] = React.useState([]);
    const editorRefs = useRef([]);

    const formatText = (command) => {
        document.execCommand(command, false, null);
        setDescription(editorRefs.current.innerHTML);
    };


    useEffect(() => {
        console.log("Fetching artworks for exhibition ID:", sessionStorage.getItem('exhibitID'));
        const formData = new FormData();
        formData.append('exhibitID', sessionStorage.getItem('exhibitID'));

        fetch('/getArtworks', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log("Artworks received:", data);
                setArtworks(data);
            })
            .catch(error => console.error('Error fetching artworks:', error));
    }, []);

    useEffect(() => {
        artworks.forEach((artwork, index) => {
            if (editorRefs.current[index] && !editorRefs.current[index].innerHTML) {
                editorRefs.current[index].innerHTML = artwork.description || ''; 
            }
        });
    }, [artworks]);

    const handleInputChange = (index, field, value) => {
        const updatedArtworks = [...artworks];
        updatedArtworks[index][field] = value;
        setArtworks(updatedArtworks);
    };


    const handleNewFile = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const updatedArtworks = [...artworks];
            const objectURL = URL.createObjectURL(file);
            updatedArtworks[index].file = objectURL;
            updatedArtworks[index].newImage = file;
            const promise = new Promise((resolve) => {
                const img = new Image();
                img.src = objectURL;
                img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
            });
    
            promise.then((ratio) => {
                updatedArtworks[index].aspectRatio = ratio;
                console.log('Aspect Ratio:', ratio);
            });
            setArtworks(updatedArtworks);
        }
    };


    const handleResubmit = (index) => {
        const artwork = artworks[index];

        const formData = new FormData();

        if (artwork.newImage) {
            formData.set("image", artwork.newImage);
            formData.set("imageUpdated", true);
            formData.set("oldImage", artwork.imageFilePath);
        } else {
            formData.set("image", artwork.imageFilePath);
            formData.set("imageUpdated", false);
        }

        formData.set("artworkID", artwork.imageID);
        formData.set("artist", artwork.artist);
        formData.set("title", artwork.title);
        formData.set("medium", artwork.medium);
        formData.set("year", artwork.year);
        formData.set("description", artwork.description);
        formData.set("exhibition", sessionStorage.getItem('exhibitID'));
        formData.set("aspectRatio", artwork.aspectRatio);

        fetch('/editArtwork', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data.message);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeleteArt = (index) => {
        const artwork = artworks[index];
        const formData = new FormData();
        formData.set("artworkID", artwork.imageID);
        formData.set("exhibition", sessionStorage.getItem('exhibitID'));

        fetch('/deleteArtwork', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data.message);
                const updatedArtworks = [...artworks];
                updatedArtworks.splice(index, 1);
                setArtworks(updatedArtworks);
            })
            .catch(error => console.error('Error:', error));
    }

    return (
        <div className="EditArtPage">
            <div className="EditArtHeader">
                <h1>Edit Exhibition</h1>
                <button className='cancelButton' onClick={() => navigate('/myExhibitions')}>Go back</button>
                <br />
                <button className='genericButton' onClick={() => navigate('/upload')}>Add new artwork</button>
                <div className="ArtworkList">
                    {artworks.map((artwork, index) => (
                        <div key={artwork.imageID} className="ArtworkItem">
                            <br />
                            <img className='imageArt' src={artwork.file || artwork.imageFilePath} alt={artwork.title} />
                            <label className='fileUpload' onChange={(e) => handleNewFile(index, e)}>
                                <input type="file" style={{display: 'none'}}/>
                                <span>Upload New Image</span>
                            </label>
                            <br />

                            <label>
                                Enter Title:
                                <input
                                    type="text"
                                    value={artwork.title}
                                    onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                                    className="textBox"
                                />
                            </label>

                            <label>
                                Enter Artist:
                                <input
                                    type="text"
                                    value={artwork.artist}
                                    onChange={(e) => handleInputChange(index, 'artist', e.target.value)}
                                    className="textBox"
                                />
                            </label>

                            <label>
                                Enter Medium:                                
                                <input
                                    type="text"
                                    value={artwork.medium}
                                    onChange={(e) => handleInputChange(index, 'medium', e.target.value)}
                                    className="textBox"
                                />
                            </label>

                            <label>
                                Enter Year:
                                <input
                                    type="text"
                                    value={artwork.year}
                                    onChange={(e) => handleInputChange(index, 'year', e.target.value)}
                                    className="textBox"
                                />
                            </label>

                            <div className='richTextdiv'>
                                Enter Description:
                                {/* Formatting Buttons */}
                                <div>
                                    <button className='genericButton' onClick={() => formatText('bold', index)} style={{ marginRight: '5px' }}><b>B</b></button>
                                    <button className='genericButton' onClick={() => formatText('italic', index)} style={{ marginRight: '5px' }}><i>I</i></button>
                                    <button className='genericButton' onClick={() => formatText('underline', index)}><u>U</u></button>
                                </div>

                                {/* Rich Text Editor (contentEditable) */}
                                <div
                                ref={(el) => (editorRefs.current[index] = el)}
                                contentEditable
                                className="richText"
                                onInput={(e) => handleInputChange(index, 'description', e.target.innerHTML)}
                                ></div>
                            </div>
                            <br />
                            <button className='cancelButton' onClick={() => handleDeleteArt(index)}>Delete</button>
                            <button className='genericButton' onClick={() => handleResubmit(index)}>Submit Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EditArt;