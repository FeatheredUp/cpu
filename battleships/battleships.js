/*

TO DO:
* Display end shapes
* Cross out numbers when the required number of ships in place
* Display 'battleship' list at the bottom and cross them out as displayed
* 'Collision' if two ships diagonal
* Alert when finished
* Add instructions and title
* Restart button
* 'Simplify' option

*/

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const board = new Board(10);
board.draw(context);

function mouseClickCanvas(pageX, pageY) { 
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;
    board.cursorClick(context, x, y);
}

canvas.addEventListener('click', function (event) {mouseClickCanvas(event.pageX, event.pageY);}, false);