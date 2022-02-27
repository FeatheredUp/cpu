/*
TO DO:
* Enhancement - Cross out numbers when the required number of ships are in place on a row
* Enhancement - Display 'battleship' list at the bottom and cross them out as displayed
* Restart button
*/
const description =  "There are 10 flower beds to find.  There is one of length 4, two of length 3, three of length 2, and four singles. A flower bed cannot touch another flower bed, even diagonally. The numbers along the edge of the grid indicate how many squares contain flower beds in that row or column. A few flower bed positions are already known.";

const map = new StoryMap(clickHint, description);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const statusElement = document.getElementById('status');
const hintButton = document.getElementById('hintButton');
const board = new Board(10);

function mouseClickCanvas(pageX, pageY) { 
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;
    const result = board.cursorClick(context, x, y);
    displayCompletion(result);
}

function clickHint() {
    const result = board.hint(context);
    displayCompletion(result);
}

function displayCompletion(result) {
    console.debug(result);
    if (result == board.Win) {
        window.setTimeout( () => { alert('Well done'); } , 200);
    }
}

const imgBackground = loadImage('../images/flowerbed.png', main);
const imgBorder = loadImage('../images/border.png', main);

let imagesLoaded = 0;
function main() {
    imagesLoaded += 1;
    if (imagesLoaded == 2) {
        context.drawImage(imgBackground, 0, 0);
        context.drawImage(imgBorder, 0, 0);
        board.draw(context);
    }
}

function loadImage(src, onload) {
    const img = new Image();
    img.onload = onload;
    img.src = src;
    return img;
}

canvas.addEventListener('click', function (event) {mouseClickCanvas(event.pageX, event.pageY);}, false);