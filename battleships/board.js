class Piece {
    board;
    row;
    column;
    state;
    actual;
    given;

    startX;
    startY;

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
        return this;
    }

    setGiven() {
        this.given = true;
        return this;
    }

    draw(context) {
        // For a ship:
        // * Is it error (if any diagonal is also a ship)
        // * TO DO Is it directional (if one side ship and opposite is set OR if it's given)
        // * TO DO Is it Single (all 4 sides are water)

        context.strokeStyle = 'blue';
        context.lineWidth = 1;
        context.fillStyle = this.getColour();
        context.beginPath();
        context.rect(this.startX, this.startY, this.board.side, this.board.side);
        context.fill();
        context.stroke();
    }

    checkError() {
        return this.board.checkError(this.row, this.column);
    }

    getColour() {
        if (this.checkError()) return 'red';

        if (this.given && this.actual == this.board.Water) return 'teal';
        if (this.given && this.actual == this.board.Ship) return 'black';

        if (this.state == this.board.Water) return 'teal';
        if (this.state == this.board.Ship) return 'black';
        return 'grey';
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

    side = 50;
    leftOffset = 350;
    topOffset = 50;

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
            this.drawText(context, rowCount[index], this.leftOffset + this.side * this.size + this.side / 2, this.topOffset + this.side * index + this.side / 2);
            this.drawText(context, colCount[index], this.leftOffset + this.side * index + this.side / 2, this.topOffset + this.side * this.size + this.side / 2);
        }
    }


    drawText(context, text, x, y) {
        context.font = '18px Verdana, sans-serif';
        context.strokeStyle = 'green';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = 'blue';
        context.fillText(text, x, y);
    }


    cursorClick(context, x, y) {
        for (const row of this.pieces) {
            for (const piece of row) {
                let hit = piece.startX < x && x < piece.startX + this.side && piece.startY < y && y < piece.startY + this.side;
                if (hit) {
                    piece.toggle();
                    this.draw(context);
                    break;
                }
            }
        }
    }

    checkError(row, col) {
        if (!this.pieces[row][col].isShip()) return false;
        for (const diagonal of this.getDiagonals(row, col)) {
            if (diagonal != null && diagonal.isShip()) return true;
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

    getNullPiece(row, col) {
        if (row < 0 || row >= this.size) return null;
        if (col < 0 || col >= this.size) return null;
        return this.pieces[row][col];
    }
}