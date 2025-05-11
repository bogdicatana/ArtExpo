
import React from 'react';
import 'aframe';
import { useNavigate } from 'react-router-dom';

const ARScene = () => {
	const navigate = useNavigate();
	const html = `
	<html>
  	<!-- include A-Frame obviously -->
	<script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
	<!-- include ar.js for A-Frame -->
	<script src="https://jeromeetienne.github.io/AR.js/aframe/build/aframe-ar.js"></script>
	<body style='margin : 0px; overflow: hidden;'>
		<a-scene embedded arjs>
			<!-- create your content here. just a box for now -->
			<a-image src="${sessionStorage.getItem('artworkPath')}" 
				position="0 0.5 0" rotation="-90 0 0" 
				width="2" 
				height="${2 / sessionStorage.getItem('artworkAspectRatio')}">
			</a-image>
			<!-- define a camera which will move according to the marker position -->
			<a-marker-camera preset='hiro'></a-marker-camera>
		</a-scene>
	</body>
	</html>
	`
	return (
		<body style={{ margin: 0, overflow: 'hidden' }}>
			<div className='ExitButton' style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                <button className='cancelButton' onClick={() => navigate('/exhibition')}>Exit</button>
            </div>
			<iframe
				srcDoc={html}
				style={{ width: '100%', height: '100vh', border: 'none' }}
				title="AR Scene"
			/>
		</body>
	);
};

export default ARScene;
