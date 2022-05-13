const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const radius = 50;

const board = new Board();
drawCanvas();




function drawCanvas() {
    for (const piece of board.pieces) {
        drawPiece(piece);
    }
}

function drawPiece(piece) {
    const lineWidth = 10;

    // segments
    context.lineWidth = lineWidth;
    const segmentRadius = radius - lineWidth / 2;
    drawSegment(piece.cx, piece.cy, segmentRadius, piece, 1);
    drawSegment(piece.cx, piece.cy, segmentRadius, piece, 2);
    drawSegment(piece.cx, piece.cy, segmentRadius, piece, 3);
    drawSegment(piece.cx, piece.cy, segmentRadius, piece, 4);

    // outlines
    context.lineWidth = 2;
    context.strokeStyle = "black";
    drawSimpleCircle(piece.cx, piece.cy, radius);
    drawSimpleCircle(piece.cx, piece.cy, radius - lineWidth);

    // segment lines
    drawLine(piece.cx - radius,             piece.cy, lineWidth, 0);
    drawLine(piece.cx + radius - lineWidth, piece.cy, lineWidth, 0);
    drawLine(piece.cx, piece.cy - radius,             0, lineWidth);
    drawLine(piece.cx, piece.cy + radius - lineWidth, 0, lineWidth);

    // label
    addLabel(radius, piece);

    // connector
    const parentPiece = getPieceById(piece.connectTo);
    if (parentPiece != null) drawConnector(piece, parentPiece);
}

function getCentre(piece) {
    const cx = leftBorder + radius + (piece.col * gridSize);
    const cy = topBorder  + radius + (piece.row * gridSize);
    return {cx: cx, cy: cy};
}

function addLabel(max, piece) {
    const value = piece.ringType == ringType_Centre ? '?' : piece.value;
    context.font = max + 'px Verdana, sans-serif';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(value, piece.cx, piece.cy, max);
}

function drawLine(x, y, dx, dy) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + dx, y + dy);
    context.stroke();
}

function drawSimpleCircle(cx, cy, radius) {
    context.beginPath();
    context.arc(cx, cy, radius, 0, 2 * Math.PI);
    context.stroke();
}

function drawSegment(cx, cy, radius, piece, segment) {
    var start = Math.PI * 0.5 * (segment - 1);
    var end = start + Math.PI * 0.5;

    context.strokeStyle = getColour(piece, segment);
    context.beginPath();
    context.arc(cx, cy, radius, start, end);
    context.stroke();
}

function drawConnector(c1, c2) {
    const dx = c2.cx - c1.cx;
    const dy = c2.cy - c1.cy;

    // pythag
    const fullLength = Math.sqrt((dx * dx) + (dy * dy));

    // similar triangles
    const ratio = radius / fullLength;
    const x = dx * ratio;
    const y = dy * ratio;

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.beginPath();
    context.moveTo(c1.cx + x, c1.cy + y);
    context.lineTo(c2.cx - x, c2.cy - y);
    context.stroke();
}

function getColour(piece, segment) {
    if (piece.ringType == ringType_End) return 'orange';
    if (piece.ringType == ringType_Connector) return 'white';

    if (segment == 1) return 'blue';
    if (segment == 2) return 'yellow';
    if (segment == 3) return 'green';
    if (segment == 4) return 'red';

    return 'black';
}

function getPieceById(searchId) {
    const piece = board.pieces.find(p => p.id == searchId)
    return piece;
}