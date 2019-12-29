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

function IsolateColorButton({ rgba, isolateColor }) {
  if (!rgba) return null;
  return (
    <button onClick={() => isolateColor() }>Isolate color</button>
  );
}

function isSimilarColor(r1, r2, g1, g2, b1, b2) {
  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)) < 30;
}

function App() {
  const [file, setFile] = useState('');
  const [rgba, setRgba] = useState('');
  const [r, setR] = useState('');
  const [g, setG] = useState('');
  const [b, setB] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const updatedCanvasRef = useRef(null);

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
    setR(data[0]);
    setG(data[1]);
    setB(data[2]);
    setRgba(rgba);
  }

  const isolateColor = () => {
    const oldCanvas = canvasRef.current;
    const oldContext = oldCanvas.getContext('2d');
    const pixel = oldContext.getImageData(0, 0, oldCanvas.width, oldCanvas.height);
    let data = pixel.data;
    for (let i = 0; i < data.length; i += 4) {
      if (!isSimilarColor(r, data[i], g, data[i + 1], b, data[i + 2])) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
    }
    const newCanvas = updatedCanvasRef.current;
    const newContext = newCanvas.getContext('2d');
    newContext.putImageData(pixel, 0, 0);
  }

  return (
    <div>
      <FileInput handleChange={handleChange} />
      <canvas ref={canvasRef} width="600" height="600" onClick={(e) => getColor(e)} />
      <img ref={imageRef} src={file} alt="" className="hidden" onLoad={() => updateCanvas(file)} />
      <ColoredDiv rgba={rgba} />{rgba}
      <IsolateColorButton rgba={rgba} isolateColor={isolateColor} />
      <canvas ref={updatedCanvasRef} width="600" height="600" />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
