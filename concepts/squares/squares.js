const canvas = document.getElementById('canvas');
canvas.addEventListener('click', canvasClick, false);
const context = canvas.getContext('2d');

const size = 13;
const canvasSize = getCanvasSize();
canvas.width = canvasSize;
canvas.height = canvasSize;
const side = canvas.width / (size + 1);

let squares = initialiseSquares(size);

drawCanvas(size, size);

function initialiseSquares(size) {
    let s = [];
    for(var row = 0; row < size; row++) {
        let newRow = [];
        for(var col = 0; col < size; col++) {
            newRow.push(0);
        }
        s.push(newRow);
    }
    return s;
}

function drawCanvas() {
    drawLabels();
    drawCurrentSquares();
}

function drawLabels() {
    context.font = '25px Monaco, Courier New, Monospace';
    const left = side/3;
    const top = side/2;
    const width = side/2
    for (let index=1; index<=size+1; index++) {
        const letter = String.fromCharCode(64 + index);
        context.fillText(letter, index * side + left, top, width);
        context.fillText(index, left, index * side + top, width);
    }
}

function drawCurrentSquares() {
    for(var row = 0; row < size; row++) {
        for(var col = 0; col < size; col++) {
            drawSquare(row, col);
        }
    }
}

function drawSquare(row, col) {
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillStyle = getColour(squares[row][col]);
    context.beginPath();
    context.rect((col+1) * side, (row+1) * side , side, side);
    context.fill();
    context.stroke();
}

function getColour(colour) {
    if (colour == 1) return 'red';
    if (colour == 2) return 'green';
    if (colour == 3) return 'blue';
    return 'white';
}

function getCanvasSize() {
    const maxWidth = window.innerWidth - 50;
    const maxHeight = window.innerHeight - 250;

    return Math.min(maxWidth, maxHeight);
}

function canvasClick(event) {
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = event.pageX - canvasLeft,
        y = event.pageY - canvasTop;

    const col = Math.floor(x / side) - 1;
    const row = Math.floor(y / side) - 1;

    if (col < 0 || row < 0) return;

    squares[row][col] += 1;
    if (squares[row][col] == 4) squares[row][col] = 0;
    drawCurrentSquares();
}