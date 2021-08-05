dragElement(document.getElementById("zoomArea"));

const canvas = document.getElementById('canvas');
canvas.addEventListener('click', function (event) {clickCanvas(event.pageX, event.pageY);}, false);
const context = canvas.getContext('2d');

const img = new Image();   
img.src = '../images/livingroom.jpg'; 
img.addEventListener('load', function() { context.drawImage(img,0,0);}, false);

const zoomCanvas = document.getElementById('zoomCanvas');
const zoomContext = zoomCanvas.getContext('2d');

const zoomImg = new Image();   
zoomImg.src = '../images/cushions.jpg'; 
zoomImg.addEventListener('load', function() { zoomContext.drawImage(zoomImg,0,0, 400, 200);}, false);
document.getElementById("zoomAreaClose").addEventListener('click', function() {document.getElementById("zoomArea").classList.add('hidden')})

let startX = 0, startY = 0;

function dragElement(elmnt) {
  getHeader(elmnt).onmousedown = dragMouseDown;
}

function getHeader(elmnt) {
    const headerElement = document.getElementById(elmnt.id + "Header");
    if (headerElement) return headerElement;
    return elmnt;
}

function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    let pos1 = startX - e.clientX;
    let pos2 = startY - e.clientY;
    startX = e.clientX;
    startY = e.clientY;

    let elmnt = e.srcElement.parentElement;

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
}

function clickCanvas(pageX, pageY) { 
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop;

    if (651 < x && x < 758 && 177 < y & y < 251) {
        document.getElementById('zoomArea').classList.remove('hidden');
    }
}