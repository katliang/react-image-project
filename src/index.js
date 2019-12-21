import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import './index.css';

function FileInput({ handleChange }) {
  return (
    <input type="file" onChange={(e) => handleChange(e)} />
  );
}

const ColoredDiv = styled.div`
  background-color: ${props => props.rgba};
  height:20px;
  width:20px;
`

function App() {
  const [file, setFile] = useState('');
  const [rgba, setRgba] = useState('');
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

  const getColor = e => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = context.getImageData(x, y, 1, 1);
    const data = pixel.data;
    const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${(data[3]/255)})`;
    setRgba(rgba);
  }

  return (
    <div>
      <FileInput 
        handleChange={handleChange}
      />
      <canvas ref={canvasRef} width="600" height="600" onClick={(e) => getColor(e)} />
      <img ref={imageRef} src={file} alt="" className="hidden" onLoad={() => updateCanvas(file)} />
      <ColoredDiv rgba={rgba} />{rgba}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
