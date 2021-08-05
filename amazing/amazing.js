const isDebug = false;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const debugText = document.getElementById('debug');
if (isDebug) debugText.classList.remove('hidden');

let mouseMode = 0;
let previousArea = '';
let imageData = [];
let timeOutId = null;

const img = new Image();
img.src = 'maze.png';

img.addEventListener('load', function () { showPicture(true); }, false);
canvas.addEventListener('click', function (event) { mouseClick(event.pageX, event.pageY); }, false);
canvas.addEventListener('mousemove', function (event) { mouseMove(event.pageX, event.pageY); }, false);

let clickAreas = new ClickAreas();
clickAreas.setDefaultZone('none', 0, 0, 1000, 1000);
clickAreas.addArea('start', 100,  65, 200, 110);
clickAreas.addArea('zone1', 100, 111, 200, 620);
clickAreas.addArea('end',   660, 666, 725, 730);

function showPicture(withText) {
    context.drawImage(img, 0, 0);
    if (!isDebug) imageData = context.getImageData(1, 1, canvas.width, canvas.height).data;

    context.fillStyle = 'black';
    if (withText) addLabel(150, 80, 'CLICK HERE', 14);
    if (withText) addLabel(150, 100, 'TO START', 14);
    addLabel(690, 695, 'END', 14);
}

function addLabel(x, y, text, fontSize) {
    context.font = fontSize + 'px Verdana, sans-serif';
    context.strokeStyle = 'green';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, x, y);
}

function mouseClick(pageX, pageY) {
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;

        const area = clickAreas.getArea(x, y);

        if (area && area.name == 'start') {
            canvas.classList.add('searching'); 
            mouseMode = 1;
        }
}

function mouseMove(pageX, pageY) {
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;

    if (mouseMode == 0) return;

    debugText.innerText = x + ', ' + y + ' ';  
    if (isBlack(x,y) || isWhite(x, y)) {
        canvas.classList.add('hidden');
        document.getElementById('intro').classList.add('hidden');
        document.getElementById('gameOver').classList.remove('hidden');
    } else {
        const area = clickAreas.getArea(x, y);
        debugText.innerText += ' ' + area.name;

        if (areaChange(area)) {
            if (area.name == 'end') {
                canvas.classList.add('hidden');
                document.getElementById('intro').classList.add('hidden');
                document.getElementById('congratulations').classList.remove('hidden');
            } else if (area.name == 'zone1') {
                display1(area.startX, area.startY, area.width(), area.height(), 'green', 'yellow');
            }
        }
    }
}

function display1(x, y, width, height, colour, nextColour) {
    context.fillStyle = colour;
    context.fillRect(x, y, width, height);
    timeOutId = setTimeout(display1, 250, x, y, width, height, nextColour, colour);
}

function areaChange(newArea) {
    if (newArea.name != previousArea) {
        if(timeOutId != null) {
            clearTimeout(timeOutId);
        }
        timeOutId = null;
        previousArea = newArea.name;
        showPicture(false);
        return true;
    }

    return false;
}

function isBlack(x, y) {
    const rgb = getRGB(x, y);
    return rgb.r < 10 && rgb.g < 10 && rgb.b < 10;
}

function isWhite(x, y) {
    const rgb = getRGB(x, y);
    return rgb.r > 250 && rgb.g > 250 && rgb.b > 250;
}

function getRGB(x, y) {
    if (isDebug) return {r: 100, g: 100, b: 100};

    const index = (y * canvas.width + x) * 4;
    const rgb = {r: imageData[index], g: imageData[index + 1], b: imageData[index + 2]};

    const display = "r" + rgb.r + ", g" + rgb.g + ", b" + rgb.b;
    debugText.innerText = display;

    return rgb;
  }
