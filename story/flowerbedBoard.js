class Point {
    context;
    x;
    y;
    constructor(context, x, y) {
        this.context = context;
        this.x = x;
        this.y = y;
    }

     moveTo() {
         context.moveTo(this.x, this.y);
     }

     lineTo() {
         context.lineTo(this.x, this.y);
     }

     arc(radius, start, end) {
        context.arc(this.x, this.y, radius, start, end);
     }
}

class PiecePoints {
    centre;
    radius;
    topLeft;
    topRight;
    bottomLeft;
    bottomRight;
    leftMid;
    topMid;
    rightMid;
    bottomMid;

    constructor(context, startX, startY, side, offset) {
        this.centre = new Point (context, startX + side / 2, startY + side / 2);
        this.radius = (side / 2) - offset;

        this.topLeft = new Point(context, startX + offset, startY + offset);
        this.topRight = new Point(context, startX + side - offset, startY + offset);
        this.bottomLeft = new Point(context, startX + offset, startY + side - offset);
        this.bottomRight = new Point(context, startX + side - offset, startY + side - offset);
        
        this.leftMid = new Point(context, startX + offset, startY + (side / 2));
        this.topMid = new Point(context, startX + (side / 2), startY + offset);
        this.rightMid = new Point(context, startX + side - offset, startY + (side / 2));
        this.bottomMid = new Point(context, startX + (side / 2), startY + side - offset);
    }
}

class Piece {
    board;
    row;
    column;
    state;
    actual;
    given;

    startX;
    startY;

    GivenShipColour = '#5252ff';
    ShipColour = '#9292ff';

    GivenWaterColour = '#00FF00';
    WaterColour = '#009900';

    UnknownColour = '#6c5a30';
    StrokeColour = 'black';

    constructor(board, row, column) {
        this.board = board;
        this.row = row;
        this.column = column;

        this.state = this.board.Unknown;
        this.actual = this.board.Water;
        this.given = false;

        this.startX = this.board.leftOffset + this.column * this.board.side;
        this.startY = this.board.topOffset + this.row * this.board.side;
    }

    toggle() {
        if (this.given) return;

        switch (this.state) {
            case this.board.Unknown:
                this.state = this.board.Water;
                break;
            case this.board.Water : 
                this.state = this.board.Ship;
                break;
            case this.board.Ship : 
                this.state = this.board.Unknown;
                break;
        }
    }

    setShip() {
        this.actual = this.board.Ship;
        if (this.given) this.state = this.actual;
        return this;
    }

    setGiven() {
        this.given = true;
        this.state = this.actual;
        return this;
    }

    draw(context) {
        const isError = this.checkError();

        this.drawFilledSquare(context, this.state != this.board.Unknown);
        this.drawShipShape(context, isError)
    }
   
    drawShipShape(context, isError) {
        // if this is a given piece OR all the sides are set & it's not an error
        const showCurves = this.given || (this.allSidesDefined() && !isError);
        const allCurves = showCurves && this.allSidesCurved();

        const leftCurve = showCurves && (allCurves || this.isCurvedSide(0, -1));
        const topCurve = showCurves && (allCurves || this.isCurvedSide(-1, 0));
        const rightCurve = showCurves && (allCurves || this.isCurvedSide(0, 1));
        const bottomCurve = showCurves && (allCurves || this.isCurvedSide(1, 0));

        context.strokeStyle = this.StrokeColour;
        context.lineWidth = 1;
        context.fillStyle = this.getColour(isError);
        const points = new PiecePoints(context, this.startX, this.startY, this.board.side, 0)

        context.beginPath();
        if (leftCurve || topCurve) {
            points.centre.arc(points.radius, Math.PI, 3*Math.PI/2);
        } else {
            points.leftMid.moveTo();
            points.topLeft.lineTo();
            points.topMid.lineTo();
        }

        if (topCurve || rightCurve) {
            points.centre.arc(points.radius, 3*Math.PI/2, 2 * Math.PI);
        } else {
            points.topRight.lineTo();
            points.rightMid.lineTo();
        }

        if (rightCurve || bottomCurve) {
            points.centre.arc(points.radius, 0, Math.PI/2);
        } else {
            points.bottomRight.lineTo();
            points.bottomMid.lineTo();
        }

        if (bottomCurve || leftCurve) {
            points.centre.arc(points.radius, Math.PI/2, Math.PI);
        } else {
            points.bottomLeft.lineTo();
            points.leftMid.lineTo();
        }        
        
        context.fill();
    }

    drawFilledSquare(context, showBackground) {
        context.strokeStyle = this.StrokeColour;
        context.lineWidth = 1;

        if (showBackground) {
            context.fillStyle = this.WaterColour;
        } else {
            context.fillStyle = this.UnknownColour;
        }
        context.beginPath();
        context.rect(this.startX, this.startY, this.board.side, this.board.side);
        context.fill();
        context.stroke();
    }

    allSidesCurved() {
        if (this.getEffectiveState() != this.board.Ship) return false;

        if (this.getNeighbourEffectiveState(-1, 0) != this.board.Water) return false;
        if (this.getNeighbourEffectiveState(1, 0) != this.board.Water) return false;
        if (this.getNeighbourEffectiveState(0, -1) != this.board.Water) return false;
        if (this.getNeighbourEffectiveState(0, 1) != this.board.Water) return false;
        return true;
    } 

    allSidesDefined() {
        if (this.getNeighbourEffectiveState(-1, 0) == this.board.Unknown) return false;
        if (this.getNeighbourEffectiveState(1, 0) == this.board.Unknown) return false;
        if (this.getNeighbourEffectiveState(0, -1) == this.board.Unknown) return false;
        if (this.getNeighbourEffectiveState(0, 1) == this.board.Unknown) return false;
        return true;
    }

    isCurvedSide(drow, dcol) {
        // If this is a ship and the OPPOSITE SIDE is a ship, this side is curved.
        if (this.getEffectiveState() != this.board.Ship) return false;
        const nearSideState = this.getNeighbourEffectiveState(drow, dcol);
        const farSideState = this.getNeighbourEffectiveState(-drow, -dcol);
        return farSideState == this.board.Ship && nearSideState == this.board.Water;
    }

    getNeighbourEffectiveState(drow, dcol) {
        const neighbour = this.board.getNullPiece(this.row + drow, this.column + dcol);
        if (neighbour == null) return this.board.Water;
        return neighbour.getState(this.given);
    }

    getEffectiveState() {
        if (this.given) return this.actual;
        return this.state;
    }

    getState(actual) {
        if (actual) return this.actual;
        return this.state;
    }

    checkError() {
        return this.board.checkError(this.row, this.column);
    }

    getColour(isError) {
        if (isError) return 'red';

        if (this.given && this.actual == this.board.Water) return this.GivenWaterColour;
        if (this.given && this.actual == this.board.Ship) return this.GivenShipColour;

        if (this.state == this.board.Water) return this.WaterColour;
        if (this.state == this.board.Ship) return this.ShipColour;
        return this.UnknownColour;
    }

    isShip() {
        if (this.given && this.actual == this.board.Ship) return true;
        if (this.state == this.board.Ship) return true;
        return false;
    }
}

class Board { 
    Unknown = 0;
    Water = 1;
    Ship = 2;

    Undecided = 0;
    Win = 1;
    Lose = 2;

    side = 50;
    leftOffset = 250;
    topOffset = 76;
    borderWidth = 7;
    borderColour = '#f0f0f0';

    size;
    pieces = [];

    constructor(size) {
        this.size = size;
        for(var row = 0; row < size; row++) {
            let newRow = [];
            for(var col = 0; col < size; col++) {
                newRow.push(new Piece(this, row, col));
            }
            this.pieces.push(newRow);
        }

        // Easy Starters 39
        this.pieces[0][0].setShip();
        this.pieces[0][1].setShip();

        this.pieces[1][5].setShip();

        this.pieces[2][5].setShip();

        this.pieces[3][1].setShip().setGiven();
        //this.pieces[3][2].setGiven();
        this.pieces[3][9].setShip();

        this.pieces[4][3].setShip().setGiven();
        this.pieces[4][4].setShip();
        this.pieces[4][5].setShip();
        this.pieces[4][6].setShip();

        this.pieces[5][1].setShip();

        this.pieces[6][1].setShip();

        this.pieces[7][1].setShip();
        this.pieces[7][3].setShip();

        this.pieces[8][5].setShip();
        this.pieces[8][6].setShip();
        this.pieces[8][7].setShip();
        this.pieces[8][9].setShip();

        this.pieces[9][1].setShip();
        this.pieces[9][2].setShip().setGiven();
    }

    draw(context) {
        context.fillStyle = this.borderColour;
        context.beginPath();
        context.rect(this.leftOffset-this.borderWidth, this.topOffset-this.borderWidth, this.side * this.size + 2 * this.borderWidth, this.side * this.size + 2 * this.borderWidth);
        context.fill();
        context.stroke();


        let rowCount = [];
        let colCount = [];
        for (let index = 0; index < this.size; index++) {
            rowCount[index] = 0;
            colCount[index] = 0;
        }

        // Draw pieces and calculate totals
        for (const row of this.pieces) {
            for (const piece of row) {
                piece.draw(context);
                if (piece.actual == this.Ship) {
                    rowCount[piece.row] += 1;
                    colCount[piece.column] += 1;
                }
            }
        }

        // Display row and column totals
        for (let index = 0; index < this.size; index++) {
            this.drawText(context, rowCount[index], 3 + this.leftOffset + this.side * this.size + this.side / 2, this.topOffset + this.side * index + this.side / 2);
            this.drawText(context, colCount[index], this.leftOffset + this.side * index + this.side / 2, 5 + this.topOffset + this.side * this.size + this.side / 2);
        }
    }

    hint(context) {
        const possibles = this.getHintablePieces();
        if (possibles.length == 0) return;
        const index = this.getRandomValue(0, possibles.length - 1);
        possibles[index].setGiven();
        this.draw(context);
        return this.getBoardCompletionState();
    }

    // returns a whole number between min and max (both inclusive).  I.e. what 'pick a number between 1 and 10' means.
    getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getHintablePieces() {
        let result = [];
        for (const row of this.pieces) {
            for (const piece of row) {
                // to be hintable, must not already be given, and must be a ship that hasn't been identified
                if (!piece.given && piece.actual == this.Ship && piece.state != this.Ship ) {
                    result.push(piece);
                }
            }
        }
        return result;
    }

    drawText(context, text, x, y) {
        context.font = '24px Verdana, sans-serif';
        context.strokeStyle = '#0f0f0f';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 3;
        context.fillStyle = '#f0f0f0';
        context.strokeText(text, x, y);
        context.fillText(text, x, y);
    }

    cursorClick(context, x, y) {
        for (const row of this.pieces) {
            for (const piece of row) {
                let hit = piece.startX < x && x < piece.startX + this.side && piece.startY < y && y < piece.startY + this.side;
                if (hit) {
                    piece.toggle();
                    this.draw(context);
                    return this.getBoardCompletionState();
                }
            }
        }
        return this.Undecided;
    }

    getBoardCompletionState() {
        // If _any_ piece that is a ship is NOT marked as a ship OR if _any_ piece that is water is marked as a ship, it's undecided

        for (const row of this.pieces) {
            for (const piece of row) {
                if (piece.actual == this.Ship && piece.state != this.Ship) return this.Undecided;
                if (piece.actual == this.Water && piece.state == this.Ship) return this.Undecided;
            }
        }

        return this.Win;
    }

    checkError(row, col) {
        const current = this.pieces[row][col];
        if (!current.isShip()) return false;
        for (const diagonal of this.getDiagonals(row, col)) {
            if (diagonal != null && diagonal.isShip()) return true;
        }
        for (const neighbour of this.getNeigbours(row, col)) {
            // If this piece is a given ship and the neighbour is set as a ship but is not actually a ship 
            if (neighbour != null && current.given && current.actual == this.Ship && neighbour.state == this.Ship && neighbour.actual != this.Ship) return true;
            // If the neighbour is a given ship and this is not an actual ship
            if (neighbour != null && neighbour.given && neighbour.actual == this.Ship && current.actual != this.Ship) return true;
        }
        return false;
    }

    getDiagonals(row, col) {
        let list = [];
        list.push(this.getNullPiece(row - 1, col - 1));
        list.push(this.getNullPiece(row - 1, col + 1));
        list.push(this.getNullPiece(row + 1, col + 1));
        list.push(this.getNullPiece(row + 1, col - 1));
        return list;
    }

    getNeigbours(row, col) {
        let list = [];
        list.push(this.getNullPiece(row - 1, col));
        list.push(this.getNullPiece(row + 1, col));
        list.push(this.getNullPiece(row, col + 1));
        list.push(this.getNullPiece(row, col - 1));
        return list;
    }

    getNullPiece(row, col) {
        if (row < 0 || row >= this.size) return null;
        if (col < 0 || col >= this.size) return null;
        return this.pieces[row][col];
    }
}