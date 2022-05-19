// Represents the graphics of the puzzle
class Graphics {
    shapes;
    puzzle;
    canvas;
    context;
    leftMargin = 65;
    topMargin = 35;
    rightMargin = 0;
    bottomMargin = 0;
    options;
    sizes;
    shapeType;
    timeStarted;

    constructor(canvas, puzzle, colourScheme, shapeType, maxWidth, maxHeight) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.shapes = [];
        this.puzzle = puzzle;
        this.options = new Options(colourScheme);
        this.shapeType = shapeType;

        this.sizes = this.getSizes(puzzle.colCount, puzzle.rowCount);

        // this.canvas.width = this.sizes.effectiveWidth;
        // this.canvas.height = this.sizes.effectiveHeight;

        this.addPieces(puzzle.pieces);

        this.timeStarted = new Date();
        this.render(null);
    }

    // Calculate the length of one side
    getSizes(colCount, rowCount) {
        if (this.shapeType == 'square') {
            const cellSide =  85;

            const effectiveWidth = (cellSide * colCount);
            const effectiveHeight = (cellSide * rowCount);

            this.leftMargin = (this.maxWidth - effectiveWidth) / 2;
            this.rightMargin = (this.maxWidth - effectiveWidth) / 2;
            this.topMargin = (this.maxHeight - effectiveHeight) / 2;
            this.bottomMargin = (this.maxHeight - effectiveHeight) / 2;

            return { cellSide: cellSide, effectiveWidth: effectiveWidth, effectiveHeight: effectiveHeight};
        }  
        
        if (this.shapeType == 'triangle') {
            const cellWidth = (this.maxWidth  - this.leftMargin - this.rightMargin) / ((colCount / 2) + 0.5);
            const cellHeight = (this.maxHeight - this.topMargin - this.bottomMargin) / (rowCount * Math.sin(Math.PI / 3));
            const cellSide = Math.min(cellWidth, cellHeight);

            const effectiveWidth = (cellSide * ((colCount / 2) + 0.5)) + this.leftMargin + this.rightMargin;
            const effectiveHeight = (cellSide * (rowCount * Math.sin(Math.PI / 3))) + this.topMargin + this.bottomMargin;

            return { cellSide: cellSide, effectiveWidth: effectiveWidth, effectiveHeight: effectiveHeight};
        }
    }

    // Add the puzzle pieces
    addPieces(pieces) {
        for (const piece of pieces) {
            this.addPiece(piece);
        }
    }

    // Add a single puzzle piece
    addPiece(piece) {
        const flowStart = this.puzzle.flowStart.row === piece.row && this.puzzle.flowStart.col === piece.col;
        if (this.shapeType == 'square') {
            this.shapes.push(new Square(piece, this.sizes.cellSide, this.leftMargin, this.topMargin, this.context, flowStart, this.options.colourScheme));
        }
        if (this.shapeType == 'triangle') {
            this.shapes.push(new Triangle(piece, this.sizes.cellSide, this.leftMargin, this.topMargin, this.context, flowStart, this.options.colourScheme));
        }
    }

    // Render the puzzle area
    render(currentPiece) {
        //this.context.fillStyle = this.options.colourScheme.back;
        //this.context.fillRect(0, 0, this.sizes.effectiveWidth, this.sizes.effectiveHeight);

        for (const shape of this.shapes) {
            shape.render(currentPiece, this.puzzle.isFinished());
        }
    }

    // Player has clicked on the canvas, take appropriate action
    clickAtPoint(pageX, pageY) {
        let canvasLeft = this.canvas.offsetLeft + this.canvas.clientLeft,
            canvasTop = this.canvas.offsetTop + this.canvas.clientTop,
            x = pageX - canvasLeft,
            y = pageY - canvasTop;
    
        let shape = this.getShapeAtPoint(x, y);
    
        if (shape != null) {
            shape.piece.interact();
            this.render(shape.piece);
            return true;
        }
        return false;
    }

    stop() {
        for (const shape of this.shapes) {
            shape.stop();
        }
    }

    undo() {
        this.puzzle.undo();
        this.render(null);
    }

    // Get the shape clicked (assumes rectangular shapes)
    getShapeAtPoint(x, y) {
        for (const shape of this.shapes) {
            if (this.shapeType == 'square' && this.isPointInSquare(x, y, shape)) {
                return shape;
            } else if (this.shapeType == 'triangle' && this.isPointInTriangle(x, y, shape)) {
                return shape;
            }
        }

        return null;
    }

    isPointInSquare(x, y, shape) {
        return (y > shape.start.y && y < shape.end.y
            && x > shape.start.x && x < shape.end.x);
    }

    isPointInTriangle(x, y, shape) {
        const as_x = x - shape.pointA.x;
        const as_y = y - shape.pointA.y;
        const s_ab = (shape.pointB.x - shape.pointA.x) * as_y- (shape.pointB.y - shape.pointA.y) * as_x > 0;
        if ((shape.pointC.x - shape.pointA.x) * as_y - (shape.pointC.y - shape.pointA.y) * as_x > 0 == s_ab) return false;
        if ((shape.pointC.x - shape.pointB.x) * (y-shape.pointB.y) - (shape.pointC.y - shape.pointB.y) * (x-shape.pointB.x) > 0 != s_ab) return false;
        return true;
    }

    getTimeTaken() {
        const milliSeconds = (new Date()).getTime() - this.timeStarted.getTime();
        return milliSeconds / 1000;
    }
}

// Represents a single shape on the grid
class Square {
    context;
    start;
    centre;
    end;
    width;
    height;
    piece;
    isFlowStart;
    colours;
    timeOutFlowStart;
    timeOutCurrent;

    constructor(piece, cellSide, xOffset, yOffset, context, isFlowStart, colours) {
        const halfcellSide = cellSide / 2;

        this.context = context;
        this.start = {x: xOffset + (piece.col * cellSide), y : yOffset + (piece.row * cellSide)};
        this.centre = {x: this.start.x + halfcellSide, y : this.start.y + halfcellSide};
        this.end = {x: this.start.x + cellSide, y : this.start.y + cellSide};
        this.width = cellSide;
        this.height = cellSide;
        this.piece = piece;
        this.isFlowStart = isFlowStart;
        this.colours = colours;
    }

    // Render this shape
    render(currentPiece, isFinished) {
        this.stop();
        // Background
        this.context.fillStyle = this.piece.invisible ? this.colours.invisible : this.piece.touched ? this.colours.touched : this.colours.back;
        this.context.fillRect(this.start.x, this.start.y, this.width, this.height);

        // Guideline
        this.context.strokeStyle = this.colours.noFlow;
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.rect(this.start.x, this.start.y, this.width, this.height);
        this.context.closePath();
        this.context.stroke();

        const brieflyVisible = currentPiece != null && this.piece.invisible && this.piece.col == currentPiece.col && this.piece.row == currentPiece.row;

        //The connectors
        if (this.piece.flow || !this.piece.invisible || brieflyVisible) {
            this.context.strokeStyle = isFinished ? this.colours.finished : this.piece.flow ? this.colours.flow : this.colours.noFlow;
            this.context.lineWidth = this.width / 6;
            this.context.lineJoin = 'bevel';
            this.context.lineCap = 'butt';

            var leftPos  = { x: this.start.x,  y: this.centre.y};
            var rightPos = { x: this.end.x,    y: this.centre.y};
            var upPos    = { x: this.centre.x, y: this.start.y};
            var downPos  = { x: this.centre.x, y: this.end.y};

            if (this.piece.left && this.piece.up) this.drawConnector(leftPos, upPos);
            if (this.piece.left && this.piece.right) this.drawConnector(leftPos, rightPos);
            if (this.piece.left && this.piece.down) this.drawConnector(leftPos, downPos);
            if (this.piece.up && this.piece.right) this.drawConnector(upPos, rightPos);
            if (this.piece.up && this.piece.down) this.drawConnector(upPos, downPos);
            if (this.piece.right && this.piece.down) this.drawConnector(rightPos, downPos);

            if (this.piece.countDirections == 1) {
                if (this.piece.left) this.drawSingle(leftPos);
                if (this.piece.right) this.drawSingle(rightPos);
                if (this.piece.up) this.drawSingle(upPos);
                if (this.piece.down) this.drawSingle(downPos);
            }

            // The flow 'start' indicator
            if (this.isFlowStart) {
                this.drawFlowStart(false);
            }
        }

        if (brieflyVisible) {
            window.setTimeout( () => { this.render(null); } , 2000);
        }
    }

    stop() {
        window.clearTimeout(this.timeOutFlowStart);
        window.clearTimeout(this.timeOutCurrent);
    }

    drawFlowStart(pulse) {
        const diamondWidth = this.width / 12;
        const diamondHeight = this.height / 6;

        this.context.beginPath();
        this.context.moveTo(this.centre.x, this.centre.y - diamondHeight);
        this.context.lineTo(this.centre.x + diamondWidth, this.centre.y);
        this.context.lineTo(this.centre.x, this.centre.y + diamondHeight);
        this.context.lineTo(this.centre.x - diamondWidth, this.centre.y);
        this.context.closePath();

        this.context.fillStyle = pulse ? this.colours.flowHighlight : this.colours.flowStart;
        this.context.lineWidth = this.width / 100;
        this.context.strokeStyle = this.colours.flowStart;
        this.context.fill();
        this.context.stroke();

        this.timeOutFlowStart = window.setTimeout( () => { this.drawFlowStart(!pulse); }, 1000);
    }

    drawConnector(firstPos, secondPos) {
        this.context.beginPath();
        this.context.moveTo(firstPos.x, firstPos.y);
        this.context.lineTo(this.centre.x, this.centre.y);
        this.context.lineTo(secondPos.x, secondPos.y);
        this.context.stroke();
    }

    drawSingle(firstPos) {
        this.context.beginPath();
        this.context.moveTo(firstPos.x, firstPos.y);
        this.context.lineTo(this.centre.x, this.centre.y);
        this.context.stroke();

        this.context.fillStyle = this.piece.flow ? this.colours.flow : this.colours.noFlow;
        this.context.beginPath();
        const radius = this.width / 7;
        this.context.arc(this.centre.x, this.centre.y, radius, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }
}
