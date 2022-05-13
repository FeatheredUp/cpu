const canvas = document.getElementById('mainCanvas');
const context = canvas.getContext('2d');

const size = 8;
const canvasSize = getCanvasSize();
canvas.width = canvasSize;
canvas.height = canvasSize;
const side = canvasSize / 20;

let grid = createEmptyGrid(size, size);
addLetters();
let shapes = initialiseShapes();

createShapes();
drawCanvas();

// ****  Create Data  ******

function createEmptyGrid(rows, cols) {
    let s = [];
    for(var row = 0; row < rows; row++) {
        let newRow = [];
        for(var col = 0; col < cols; col++) {
            newRow.push({row:row, col: col, colour: "white", letter: ''});
        }
        s.push(newRow);
    }
    return s;
}

function addLetters() {
    addRowLetters(grid[0], 'PACURILE');
    addRowLetters(grid[1], 'FRLIUOST');
    addRowLetters(grid[2], 'HOSOAUND');
    addRowLetters(grid[3], 'BGVATEHS');
    addRowLetters(grid[4], 'SQJHEODY');
    addRowLetters(grid[5], 'BAOXNKGM');
    addRowLetters(grid[6], 'TSTLAIZN');
    addRowLetters(grid[7], 'BOFLOAKW');

}
function addRowLetters(row, letters) {
    if (letters.length != row.length) alert('No');
    for (let index = 0; index < row.length; index++) {
        row[index].letter = letters[index];
    }
}

function addRandomLetters() {
    for (const row of grid) {
        for (const cell of row) {
            cell.letter = randomLetter();
        }
    }
}

function randomLetter() {
    return String.fromCharCode(64 + getRandomValue(1, 26));
}

// returns a whole number between min and max (both inclusive).  I.e. what 'pick a number between 1 and 10' means.
function getRandomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function* initialiseShapes() {
    yield initialiseShape1();
    yield initialiseShape2();
    yield initialiseShape3();
    yield initialiseShape4();
    yield initialiseShape5();
    yield initialiseShape6();
    yield initialiseShape7();
    yield initialiseShape8();
    yield initialiseShape9();
}

function initialiseShape1() {
    let shape = createEmptyGrid(2, 2);
    shape[0][0].colour = 'red';
    shape[0][1].colour = 'red';
    shape[1][0].colour = 'red';
    shape[1][1].colour = 'red';
    return shape;
}

function initialiseShape2() {
    let shape = createEmptyGrid(3, 2);
    shape[0][1].colour = 'orange';
    shape[1][1].colour = 'orange';
    shape[2][0].colour = 'orange';
    shape[2][1].colour = 'orange';
    return shape;
}

function initialiseShape3() {
    let shape = createEmptyGrid(2, 3);
    shape[0][1].colour = 'green';
    shape[1][0].colour = 'green';
    shape[1][1].colour = 'green';
    shape[1][2].colour = 'green';
    return shape;
}

function initialiseShape4() {
    let shape = createEmptyGrid(2, 3);
    shape[0][1].colour = 'yellow';
    shape[0][2].colour = 'yellow';
    shape[1][0].colour = 'yellow';
    shape[1][1].colour = 'yellow';
    return shape;
}

function initialiseShape5() {
    let shape = createEmptyGrid(2, 2);
    shape[0][0].colour = 'blue';
    shape[0][1].colour = 'blue';
    shape[1][0].colour = 'blue';
    return shape;
}

function initialiseShape6() {
    let shape = createEmptyGrid(2, 1);
    shape[0][0].colour = 'purple';
    shape[1][0].colour = 'purple';
    return shape;
}

function initialiseShape7() {
    let shape = createEmptyGrid(2, 2);
    shape[0][0].colour = 'pink';
    shape[0][1].colour = 'pink';
    shape[1][1].colour = 'pink';
    return shape;
}

function initialiseShape8() {
    let shape = createEmptyGrid(2, 2);
    shape[0][0].colour = 'lime';
    shape[1][0].colour = 'lime';
    shape[1][1].colour = 'lime';
    return shape;
}

function initialiseShape9() {
    let shape = createEmptyGrid(2, 2);
    shape[0][1].colour = 'aqua';
    shape[1][0].colour = 'aqua';
    shape[1][1].colour = 'aqua';
    return shape;
}
// ****  Canvas  ******

function drawCanvas() {
    for (const row of grid) {
        for (const cell of row) {
            drawSquare(context, cell);
        }
    }
}

function drawSquare(c, cell) {
    c.strokeStyle = 'black';
    c.lineWidth = 1;
    c.fillStyle = cell.colour;
    c.font = '25px Monaco, Courier New, Monospace';

    c.beginPath();
    c.rect(cell.col * side, cell.row * side , side, side);
    c.fill();
    c.stroke();

    c.fillStyle = 'black';
    c.fillText(cell.letter, cell.col * side + (side/3), (cell.row+1) * side - (side/6), side);
}

function getCanvasSize() {
    const maxWidth = window.innerWidth - 50;
    const maxHeight = window.innerHeight - 400;

    return Math.min(maxWidth, maxHeight);
}

function createShapes() {
    const gap = 10;
    let xPos = gap;
    for (const shape of shapes) {
        let can = document.createElement('canvas');
        can.style.zIndex = 1;
        can.height = shape.length * side;
        can.width = shape[0].length * side;
        can.style.left = xPos + "px";
        document.getElementById('shapeArea').appendChild(can);
        dragElement(can);
        can.classList.add('shape');
        let ctx = can.getContext('2d');
        for (const row of shape) {
            for (const cell of row) {
                if (cell.colour == 'white') continue;
                drawSquare(ctx, cell);
            }
        }
        xPos += can.width + gap;
    }
}

// ****  DRAG AND DROP  ******

let startX = 0, startY = 0;

function dragElement(elmnt) {
    elmnt.onmousedown = dragMouseDown;
}

function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    e.srcElement.style.zIndex = 99;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    let posX = startX - e.clientX;
    let posY = startY - e.clientY;
    startX = e.clientX;
    startY = e.clientY;

    let elmnt = e.srcElement;

    elmnt.style.top = (elmnt.offsetTop - posY) + "px";
    elmnt.style.left = (elmnt.offsetLeft - posX) + "px";
}

function closeDragElement(e) {
    e = e || window.event;
    e.srcElement.style.zIndex = 0;
    document.onmouseup = null;
    document.onmousemove = null;
}