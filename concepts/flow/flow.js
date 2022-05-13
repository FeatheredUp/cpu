const canvas = document.getElementById('canvas');
const difficulty = getDifficulty();
const level = 1;
const invisibility = false;
let puzzle = new Puzzle(difficulty, level, invisibility);
const graphics = new Graphics(canvas, puzzle, 'default', 'square', 1000, 650);

function clickCanvas(x, y){
    let hit = graphics.clickAtPoint(x, y);

    if (hit) {
        if (graphics.puzzle.isFinished()) {
            congratulate();
        }
    }
}

function getDifficulty() {
    let difficulty = parseInt(window.location.search.replace("?", ''));
    if (isNaN(difficulty) || difficulty < 1 || difficulty > 2) difficulty = 1;
    return difficulty;
}

function congratulate() {
    window.setTimeout( () => { alert('Congratulations'); } , 200);
}

canvas.addEventListener('click', function (event) {clickCanvas(event.pageX, event.pageY);}, false);
