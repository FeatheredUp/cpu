const description =  "Something something something";

const game = new Game(clickHint, description);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const keyWordTextbox = createKeyWordTextbox(canvas, '6738');
const puzzleProgress = 1;

function clickHint() {
    alert('hint here');
}

const imgBackground = loadImage('applications/puzzle.png', main);
const imgBackground2 = loadImage('applications/main.png');

function main() {
    context.drawImage(imgBackground, 0, 0);
    keyWordTextbox.focus();
}

function loadImage(src, onload) {
    const img = new Image();
    if (onload) img.onload = onload;
    img.src = src;
    return img;
}

function createKeyWordTextbox(c, answer) {
    const cleft = c.offsetLeft;
    const ctop = c.offsetTop;  
    const style = "position:absolute; left: " + (cleft+370) + "px; top: " + (ctop+128) + "px; width: 340; height: 39px; " 
                + "font-family: 'verdana'; font-size: 24px; text-transform: uppercase; color: white; background-color: transparent; border: none; outline: none;";
    
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'enter code...';
    input.style = style;
    input.maxLength = 4;
    input.addEventListener('keyup', () => {
        if (input.value.toUpperCase() == answer) {
            alert('Yeah that\'s it');
            preparePart2();
        }
    }, false);
    input.focus();
    
    document.body.appendChild(input);

    return input;
}

function preparePart2() {
    hideKeyword();
    context.drawImage(imgBackground2, 0, 0);
    puzzleProgress = 2;
}

function hideKeyword() {
    keyWordTextbox.classList.add('hidden');
}