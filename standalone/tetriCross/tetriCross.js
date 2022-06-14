const description =  "Description here.";

/* 
  TO DO
  * Stop overlap of shapes either on or off the grid
  * Key hint
  * Numbered pieces hint
  * Extra hints
  * Enetering the keyword
  * Description
*/

const fullWidth = 1000;
const fullHeight = 650;
const grid = 48;
const leftOffset = 75;
const topOffset = 136;
const gridWidth = grid * 8;
const gridHeight = grid * 8;

// Should this come from the game in the end?
let hintCount = 0;

const canvas = document.getElementById('canvas');
const keyWordTextbox = createKeyWordTextbox(canvas, 'BLOOD');

const f = new fabric.Canvas('canvas', { selection: false });
setBackgroundImage('tetriCross/tetriCross.png');
loadTiles();

function clickHint() {
    hintCount += 1;
    if (hintCount == 1) {
        setBackgroundImage('tetriCross/tetriCross_hint1.png');
    } else if (hintCount == 2) {
        showTileHints();
    } else if (hintCount == 3) {
        setBackgroundImage('tetriCross/tetriCross_hint2.png');
    } else {
        alert('the keyword is BLOOD');
    }
}

function setBackgroundImage(img) {
    f.setBackgroundImage(img, f.renderAll.bind(f), {originX: 'left', originY: 'top'});
}

function createKeyWordTextbox(c, answer) {
    const cleft = c.offsetLeft;
    const ctop = c.offsetTop;  
    const style = "position:absolute; left: " + (cleft+97) + "px; top: " + (ctop+61) + "px; width: 340; height: 39px; " 
                + "font-family: 'verdana'; font-size: 28px; text-transform: uppercase; background-color: transparent; border: none; outline: none;";
    
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'enter keyword...';
    input.style = style;
    input.className = 'hidden';
    input.addEventListener('keyup', () => {
        if (input.value.toUpperCase() == answer) {
            alert('Well done!');
            document.getElementById('result').innerHTML = 'Solved with ' + hintCount + ' hints';
        }
    }, false);
    
    document.body.appendChild(input);

    return input;
}

function loadTiles() {
    loadImage('tetriCross/tetri1.png', 1, 580, 70, 6, 1);
    loadImage('tetriCross/tetri2.png', 2, 760, 70, 6, 7);
    loadImage('tetriCross/tetri3.png', 3, 560, 170, 3, 2);
    loadImage('tetriCross/tetri4.png', 4, 760, 170, 1, 7);
    loadImage('tetriCross/tetri5.png', 5, 570, 290, 7, 4);
    loadImage('tetriCross/tetri6.png', 6, 760, 270, 3, 6);
    loadImage('tetriCross/tetri7.png', 7, 790, 470, 6, 4);
    loadImage('tetriCross/tetri8.png', 8, 760, 370, 2, 4);
    loadImage('tetriCross/tetri9.png', 9, 580, 470, 1, 1);
}

function loadImage(url, number, left, top, correctX, correctY) {
    fabric.Image.fromURL(url, function(img) {
        img.hasControls = false;
        img.perPixelTargetFind = true;
        img.left = left;
        img.top = top;
        img.number = number;
        img.correctX = correctX;
        img.correctY = correctY;
        f.add(img);
      });
}

function overGridArea(target) {
    // top + half grid must be > start
    // top + shape height - half grid must be < offset + full height
    // left + half grid must be > start
    // left + shape width - half grid must be < offset + full width 

    return target.top + grid/2 > topOffset 
        && target.top + target.height - grid/2 < topOffset + gridHeight 
        && target.left + grid/2 > leftOffset 
        && target.left + target.width - grid/2 < leftOffset + gridWidth;
}

function stopMoveOffScreen(target) {
    if (target.left < 0) target.set({left:0});
    if (target.top < 0) target.set({top:0});
    if (target.left + target.width > fullWidth) target.set({left:fullWidth - target.width});
    if (target.top + target.height > fullHeight) target.set({top:fullHeight - target.height});
}

function countCorrect() {
    var countCorrect = 0;
    var tiles = f.getObjects();
    for (const tile of tiles) {
        const currentX = ((tile.left - leftOffset) / grid) + 1;
        const currentY = ((tile.top - topOffset) / grid) + 1;
        if (tile.correctX == currentX && tile.correctY == currentY) countCorrect += 1;
    }
    return countCorrect;
}

function lockTiles() {
    var tiles = f.getObjects();
    for (const tile of tiles) {
        tile.set({          
            lockMovementX : true,
            lockMovementY: true,
            selectable: false
        })
    }
}

function showTileHints() {
    var tiles = f.getObjects();
    for (const tile of tiles) {
        tile.setSrc('tetriCross/tetri' + tile.number + '_hint.png', function(i) {f.renderAll();});
    }
}

function showKeyword() {
    keyWordTextbox.classList.remove('hidden');
    keyWordTextbox.focus();
}

// snap to grid
f.on('object:moving', function(options) { 
    if (overGridArea(options.target)) {
        options.target.set({
            left: leftOffset + Math.round((options.target.left - leftOffset) / grid) * grid,
            top: topOffset + Math.round((options.target.top - topOffset) / grid) * grid
        });
    }
    stopMoveOffScreen(options.target);
});

f.on('object:modified', function(options) { 
    if (overGridArea(options.target)) {
        const count = countCorrect();
        //if (count == 9) {
        if (count == 9) {
            alert('You\'ve found all the words, now enter the keyword');
            showKeyword();
            lockTiles();
        }
    }
});

document.getElementById('hint').addEventListener('click', function() {
    if (confirm('Do you wish to use a hint token?')) {
        clickHint();
    }
})