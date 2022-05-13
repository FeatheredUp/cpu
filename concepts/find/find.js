class ClickArea{
    name;
    startX;
    startY;
    endX;
    endY;
    found;
    constructor(name, startX, startY, endX, endY){
        this.name = name;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.found = false;
    }

    getCentre() {
        return {x: (this.startX + this.endX) / 2, y: (this.startY + this.endY) / 2};
    }

    getRadius() {
        return Math.max(this.endX - this.startX, this.endY - this.startY) / 2;
    }

    isFound() {
        this.found = true;
    }
}

let clickAreas = [];
clickAreas.push(new ClickArea('cigar',    575, 353, 599, 370));
clickAreas.push(new ClickArea('flowers',  499, 212, 534, 252));
clickAreas.push(new ClickArea('blue pot', 211, 246, 234, 256));
clickAreas.push(new ClickArea('one',      446,  53, 490, 106));
clickAreas.push(new ClickArea('tree',     286,  86, 328, 141));
clickAreas.push(new ClickArea('handles',  707, 152, 731, 168));

const canvas = document.getElementById('canvas');
canvas.addEventListener('mousemove', function (event) {mouseMoveCanvas(event.pageX, event.pageY);}, false);
const context = canvas.getContext('2d');

const img = new Image();   
img.src = '../../images/livingroom.jpg'; 
img.addEventListener('load', function() { context.drawImage(img,0,0);}, false);

updateItemList();

function updateItemList() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';
    for (area of clickAreas) {
        if (area.found) {
            let li = document.createElement('li');
            li.innerText = area.name; 
            itemList.appendChild(li);
        }
    }
}
const temp = document.getElementById('temp');
let timeoutId = null;
let hoverArea = null;
function mouseMoveCanvas(pageX, pageY) { 
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;

    const inArea = hoverArea && (hoverArea.startX < x && x < hoverArea.endX && hoverArea.startY < y && y < hoverArea.endY)

    if (timeoutId && hoverArea && !(hoverArea.startX < x && x < hoverArea.endX && hoverArea.startY < y && y < hoverArea.endY)) {
        clearTimeout(timeoutId);
        timeoutId = null;
        hoverArea = null;
    }

    if (timeoutId == null) {
        for (area of clickAreas) {
            let hit = !area.found && area.startX < x && x < area.endX && area.startY < y && y < area.endY;
            if (hit) {
                hoverArea = area;
                timeoutId = setTimeout(foundArea, 5000, area);
            }
        }
    }
}

function foundArea(area) {;
    timeoutId = null;
    area.isFound();
    const centre = area.getCentre();
    const radius = area.getRadius();
    context.lineWidth = 3;
    context.strokeStyle = "red";
    context.beginPath();
    context.arc(centre.x, centre.y, radius, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
    updateItemList();
}

