const description =  "There are 10 flower beds to find.  There is one of length 4, two of length 3, three of length 2, and four singles. A flower bed cannot touch another flower bed, even diagonally. The numbers along the edge of the grid indicate how many squares contain flower beds in that row or column. A few flower bed positions are already known.";

const game = new Game(clickHint, description);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
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
        window.setTimeout( () => { 
            alert('Well done');
            game.unlockNext(); 
        } , 200);
    }
}

const imgBackground = loadImage('flowerbed/flowerbed.png', main);
let imagesLoaded = 0;
function main() {
    gameImagesLoaded += 1;
    if (gameImagesLoaded == 1) {
        context.drawImage(imgBackground, 0, 0);
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