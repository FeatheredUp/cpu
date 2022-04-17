const description =  "Description here.";
const map = new StoryMap(clickHint, description);

function clickHint() {
    alert('hint here');
}

/* 
  TO DO
  * Stop overlap of shapes either on or off the grid
  * Recognise when everything in the correct places
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

const canvas = document.getElementById('canvas');
const f = new fabric.Canvas('canvas', { selection: false });

f.setBackgroundImage('../images/tetriCross.png', f.renderAll.bind(f), {
  originX: 'left',
  originY: 'top'
});


loadImage('../images/tetri1.png', 580, 70, 6, 1);
loadImage('../images/tetri2.png', 760, 70, 6, 7);
loadImage('../images/tetri3.png', 560, 170, 3, 2);
loadImage('../images/tetri4.png', 760, 170, 1, 7);
loadImage('../images/tetri5.png', 570, 290, 7, 4);
loadImage('../images/tetri6.png', 760, 270, 3, 6);
loadImage('../images/tetri8.png', 760, 370, 2, 4);
loadImage('../images/tetri9.png', 580, 470, 1, 1);
loadImage('../images/tetri7.png', 790, 470, 6, 4);

function loadImage(url, left, top, correctX, correctY) {
    fabric.Image.fromURL(url, function(img) {
        img.hasControls = false;
        img.perPixelTargetFind = true;
        img.left = left;
        img.top = top;
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
        if (count == 9) {
            alert('congratulations');
        }
    }
});