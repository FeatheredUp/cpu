const description =  "Something something something";

const game = new Game(clickHint, description);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function clickHint() {
    alert('hint here');
}