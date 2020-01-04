import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const ColoredDiv = styled.div`
  background-color: ${props => props.rgba};
  height: 20px;
  width: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 3px;
`

const StyledText = styled.div`
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
`

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;


  & > * {
    margin: 10px;
  }
`

const HiddenImage = styled.img`
  display: none;
`

function FileInput({ getFile }) {
  return (
    <input type="file" onChange={(e) => getFile(e)} />
  );
}

function SelectColorText({ file }) {
  if (!file) return null;
  return (
    <StyledText>Select a color from your image.</StyledText>
  );
}

function SelectedColor({ rgba }) {
  if (!rgba) return null;
  return (
    <StyledText>Selected color: <ColoredDiv rgba={rgba} /></StyledText>
  );
}

function isSimilarColor(r1, r2, g1, g2, b1, b2) {
  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)) < 30;
}

function isValidImage(url, callback) {
  const image = new Image();
  image.onload = function() {
    callback(true);
  }
  image.onerror = function() {
    callback(false);
  }
  image.src = url;
}

function clearCanvas(canvas, imageWidth, imageHeight) {
  const context = canvas.getContext('2d');
  if (imageWidth && imageHeight) {
    context.clearRect(0, 0, imageWidth, imageHeight);
  }
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
  const invalidFileErrorMsg = "Oops, that doesn't look like a valid image file. Please try again.";
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const getFile = e => {
    if (e.target.files[0]) {
      const uploadFile = URL.createObjectURL(e.target.files[0]);
      isValidImage(uploadFile, function(isValid) {
        if (isValid) {
          setFile(uploadFile);
        } else {
          clearCanvas(canvasRef.current, imageWidth, imageHeight);
          setFile('');
          setRgba('');
          alert(invalidFileErrorMsg);
        }
      });
    } else {
      clearCanvas(canvasRef.current, imageWidth, imageHeight);
      setFile('');
      setRgba('');
      alert(invalidFileErrorMsg);
    }
  }

  const getImageHeightWidth = () => {
    const image = imageRef.current;
    setImageWidth(image.width);
    setImageHeight(image.height);
  }

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    canvas.width = imageWidth;
    canvas.height = imageHeight;
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
    if (r === "" && g === "" && b === "") return;
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
    newCanvas.width = imageWidth;
    newCanvas.height = imageHeight;
    const newContext = newCanvas.getContext('2d');
    newContext.putImageData(pixel, 0, 0);
  }

  useEffect(() => {
    updateCanvas();
    isolateColor();
  });

  return (
    <div>
      <FlexContainer>
        <StyledText>Choose an image: </StyledText>
        <FileInput getFile={getFile} />
        <canvas ref={canvasRef} onClick={(e) => getColor(e)} />
        <HiddenImage ref={imageRef} src={file} alt="user-upload" onLoad={getImageHeightWidth} />
        <SelectColorText file={file} />
        <SelectedColor rgba={rgba} />
        <canvas ref={updatedCanvasRef} />
      </FlexContainer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
