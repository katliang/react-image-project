import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function FileInput({ handleChange }) {
	return (
		<input type="file" onChange={(e) => handleChange(e)} />
	);
}

function App() {
	const [file, setFile] = useState('');
	const canvasRef = useRef(null);
	const imageRef = useRef(null);

	const handleChange = e => {
		setFile(URL.createObjectURL(e.target.files[0]));
	}

	const updateCanvas = file => {
		if (!file) return;
		const canvas = canvasRef.current;
		const image = imageRef.current;
		const context = canvas.getContext('2d');
		context.drawImage(image, 0, 0);
	}

  return (
  	<div>
    	<FileInput 
    		handleChange={handleChange}
    	/>
    	<canvas ref={canvasRef} width="600" height="600" />
    	<img ref={imageRef} src={file} alt="" className="hidden" onLoad={() => updateCanvas(file)}/>
  	</div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
