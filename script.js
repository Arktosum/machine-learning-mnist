import Canvas  from "./Canvas.js";


const canvas = document.getElementById('canvas');
let ctx = new Canvas(canvas,784,784);
ctx.setBackground('black')

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawLine(e) {
  if (!isDrawing) return;
  ctx.line({x:lastX, y:lastY},{x:e.offsetX, y:e.offsetY},'white',50);
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
  isDrawing = false;
  processImage();
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawLine);
canvas.addEventListener('mouseup', stopDrawing);
// canvas.addEventListener('mouseout', stopDrawing);

const CELLS = document.getElementsByClassName('grid-cell')

const scaledCanvas = document.createElement('canvas');
scaledCanvas.width = 28;
scaledCanvas.height = 28;
const scaledCtx = scaledCanvas.getContext('2d');

function setCell(i,color){
    CELLS[i].style.backgroundColor = color
}
function RGBtoGrayScale(r,g,b){
    // return 0.3*r + 0.59*g + 0.11*b
    return (r+g+b)/3
}
function processImage(){
    scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);
    // get the pixel data of the scaled down image
    const imageData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
    const pixelData = imageData.data;

    // loop through the pixel data and log the values
    let INPUT_DATA = [[]]
    for (let i = 0; i < pixelData.length; i += 4) {
        const red = pixelData[i];
        const green = pixelData[i + 1];
        const blue = pixelData[i + 2];
        const alpha = pixelData[i + 3];
        INPUT_DATA[0].push(RGBtoGrayScale(red,green,blue))
        setCell(i/4,`rgba(${red},${green},${blue},${alpha})`)
        // console.log(`Pixel ${i / 4}: R=${red}, G=${green}, B=${blue}, A=${alpha}`);
    }
    runModel(INPUT_DATA)

}
async function runModel(INPUT_DATA){
    const model = await tf.loadLayersModel('./model/model.json');
    let prediction= model.predict(tf.tensor2d(INPUT_DATA))
    prediction = prediction.dataSync();
    let maxInd = 0
    let maxValue = prediction[0]
    for(let i = 0 ; i < prediction.length;i++){
        if(prediction[i] > maxValue){
            maxValue = prediction[i]
            maxInd = i
        }
    }
    alert("Prediction : " + maxInd)
}

