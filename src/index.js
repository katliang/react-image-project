import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function FileInput({ handleChange }) {
	return (
		<input type="file" onChange={(e) => handleChange(e)} />
	);
}

function App() {
	const [file, setFile] = useState('');

	const handleChange = e => {
		setFile(URL.createObjectURL(e.target.files[0]));
	}

  return (
  	<div>
    	<FileInput 
    	handleChange={handleChange}
    	/>
    	<img src={file} alt="" />
  	</div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
