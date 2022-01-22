/*

TO DO:
* Enhancement - Cross out numbers when the required number of ships are in place on a row
* Enhancement - Display 'battleship' list at the bottom and cross them out as displayed
* Restart button
* 'Simplify' option
*/

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const statusElement = document.getElementById('status');

const board = new Board(10);
board.draw(context);

function mouseClickCanvas(pageX, pageY) { 
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;
    const result = board.cursorClick(context, x, y);
    console.debug(result);
    if (result == board.Win) {
        statusElement.innerText = 'Well done!';
        alert('Well done!');
    } else if (result == board.Lose) {
        statusElement.innerText = 'Something is wrong...';
    }
}

canvas.addEventListener('click', function (event) {mouseClickCanvas(event.pageX, event.pageY);}, false);