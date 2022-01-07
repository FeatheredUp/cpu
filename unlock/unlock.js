class ClickArea{
    name;
    colour;
    startX;
    startY;
    endX;
    endY;
    count;
    context;
    constructor(context, name, colour, startX, startY, width, height){
        this.context = context;
        this.name = name;
        this.colour = colour;
        this.startX = startX;
        this.startY = startY;
        this.endX = startX + width;
        this.endY = startY + height;
        this.count = 0;
    }

    getCentre() {
        return {x: (this.startX + this.endX) / 2, y: (this.startY + this.endY) / 2};
    }

    getRadius() {
        return Math.max(this.endX - this.startX, this.endY - this.startY) / 2;
    }

    addOne() {
        this.count += 1;
        if (this.count == 10) this.count = 0;
        this.showCount();
    }

    showCount() {
        const x = this.startX + 10;
        const y = this.startY + 2;

        this.context.fillStyle = this.colour;
        this.context.fillRect(x, y, 15, 25);

        this.context.font = '20px sans-serif';
        this.context.fillStyle = 'black';
        this.context.textBaseline = "top";
        this.context.fillText(this.count, x, y);
    }
}

let clickAreas = [];
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function findArea(x, y) {
    for (let area of clickAreas) {
        let hit = !area.found && area.startX < x && x < area.endX && area.startY < y && y < area.endY;
        if (hit) {
            return area;
        }
    }
    return null;
}

function mouseClickCanvas(pageX, pageY) { 
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;
    let area = findArea(x, y);

    if (area != null) {
        document.getElementById('debug').innerHTML = area.name;
        area.addOne();
    }
}

function mouseOverCanvas(pageX, pageY) { 
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;
    document.getElementById('debug').innerHTML = '(' + x + ', ' + y + ')';
}

function initialiseClickAreas() {
    const width = 35;
    const height = 35;
    clickAreas.push(new ClickArea(context, 'red',    '#ED1B25', 516, 390, width, height));
    clickAreas.push(new ClickArea(context, 'yellow', '#FFF200', 591, 427, width, height));
    clickAreas.push(new ClickArea(context, 'blue',   '#00A1E8', 624, 490, width, height));
    clickAreas.push(new ClickArea(context, 'green',  '#22B14C', 591, 565, width, height));
    clickAreas.push(new ClickArea(context, 'orange', '#FF7F27', 516, 602, width, height));
    clickAreas.push(new ClickArea(context, 'pink',   '#FFAEC9', 440, 565, width, height));
    clickAreas.push(new ClickArea(context, 'purple', '#A249A4', 412, 490, width, height));
    clickAreas.push(new ClickArea(context, 'brown',  '#B97A57', 440, 427, width, height));

    for (let area of clickAreas) {
        area.showCount();
    }
}

const img = new Image();   
img.src = '../images/unlock.png'; 
img.addEventListener('load', function() { 
    context.drawImage(img,0,0);
    initialiseClickAreas();
}, false);

canvas.addEventListener('click', function (event) {mouseClickCanvas(event.pageX, event.pageY);}, false);
//canvas.addEventListener('mousemove', function (event) {mouseOverCanvas(event.pageX, event.pageY);}, false);
