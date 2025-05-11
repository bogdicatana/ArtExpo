import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadArt.css';
import logo from '../logo.png';

function ImageUploadP() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [artist, setArtist] = useState('');
    const [title, setTitle] = useState('');
    const [medium, setMedium] = useState('');
    const [year, setYear] = useState('');
    const [aspectRatio, setAspectRatio] = useState('');
    const [description, setDescription] = useState('');

    const imageArt = useRef(null);
    const editorRef = useRef(null);

    function getFile(event) {
        const objectURL = URL.createObjectURL(event.target.files[0]);
        setFile(objectURL);
        const promise = new Promise((resolve) => {
            const img = new Image();
            img.src = objectURL;
            img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
        });

        promise.then((ratio) => {
            setAspectRatio(ratio);
            console.log('Aspect Ratio:', ratio);
        });
    }

    const formatText = (command) => {
        document.execCommand(command, false, null);
        setDescription(editorRef.current.innerHTML);
    };

    const sendArtworkForm = (e) => {
        e.preventDefault();
        if (!imageArt.current.files[0]) {
            alert("Please upload an image.");
            return;
        }
        if (!artist || !title || !medium || !year || !description ||description === '') {
            alert("Please fill in all fields.");
            return;
        }

        const formData = new FormData();
        formData.set("image", imageArt.current.files[0]);
        formData.set("artist", artist);
        formData.set("title", title);
        formData.set("medium", medium);
        formData.set("year", year);
        formData.set("exhibition", sessionStorage.getItem('exhibitID'));
        formData.set("description", description); 
        formData.set("aspectRatio", aspectRatio);

        fetch('/artworkFormUpload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data.message);
            navigate('/editArt');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='uploadArt'>
            <div className='uploadArtForm'>
                <img className='AppLogo' src={logo} alt="Logo" />
                <label className='fileUpload' onChange={getFile}>
                    <input ref={imageArt} type="file" style={{display: 'none'}}/>
                    <span>Upload Image</span>
                </label>
                {/* <input type="file" onChange={getFile} ref={imageArt}></input> */}
                <img className='imageArt' src={file} alt="Preview" />

                <label>
                    Enter Artist Name:
                    <input
                        type="text"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className="textBox"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </label>

                <label>
                    Enter Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="textBox"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </label>

                <label>
                    Enter Medium:
                    <input
                        type="text"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        className="textBox"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </label>

                <label>
                    Enter Year:
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="textBox"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </label>

                <div className='richTextdiv'>
                    Enter Description:
                    {/* Formatting Buttons */}
                    <div>
                        <button className='genericButton' onClick={() => formatText('bold')} style={{ marginRight: '5px' }}><b>B</b></button>
                        <button className='genericButton' onClick={() => formatText('italic')} style={{ marginRight: '5px' }}><i>I</i></button>
                        <button className='genericButton' onClick={() => formatText('underline')}><u>U</u></button>
                    </div>

                    {/* Rich Text Editor (contentEditable) */}
                    <div
                        ref={editorRef}
                        contentEditable
                        className="richText"
                        onInput={() => setDescription(editorRef.current.innerHTML)}
                    ></div>
                </div>
                <div style={{gap: '10px', display: 'flex', justifyContent: 'center'}}>
                    <button className="cancelButton" onClick={() => navigate('/editArt')}>Cancel</button>
                    <button className='genericButton' onClick={sendArtworkForm}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default ImageUploadP;
