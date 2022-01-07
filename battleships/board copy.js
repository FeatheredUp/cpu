class Piece {
    Unknown = 0;
    Water = 1;
    Ship = 2;

    side = 50;
    leftOffset = 350;
    topOffset = 50;

    row;
    column;
    state;
    actual;

    startX;
    startY;
    constructor(row, column) {
        this.column = column;
        this.row = row;
        this.state = this.Unknown;
        this.actual = this.Water;
        this.startX = this.leftOffset + this.column * this.side;
        this.startY = this.topOffset + this.row * this.side;
    }

    toggle() {
        switch (this.state) {
            case this.Unknown:
                this.state = this.Water;
                break;
            case this.Water : 
                this.state = this.Ship;
                break;
            case this.Ship : 
                this.state = this.Unknown;
                break;
        }
    }

    setShip() {
        this.actual = this.Ship;
    }

    draw(context) {
        context.strokeStyle = 'blue';
        context.lineWidth = 1;
        context.fillStyle = this.getColour();
        context.beginPath();
        context.rect(this.startX, this.startY, this.side, this.side);
        context.fill();
        context.stroke();
    }

    getColour() {
        if (this.state == this.Water) return 'teal';
        if (this.state == this.Ship) return 'black';
        return 'grey';
    }
}

class Board { 
    pieces = [];
    constructor(size) {
        for (let row = 0; row < size; row++) {
            for (let column = 0; column < size; column++) {
                this.pieces.push(new Piece(row, column));
            }
        }

        // Hard-coded grid
        this.findPiece(0, 0).setShip();
        this.findPiece(1, 0).setShip();
        this.findPiece(2, 0).setShip();
        this.findPiece(8, 0).setShip();

        this.findPiece(2, 2).setShip();       
        this.findPiece(4, 2).setShip();
        this.findPiece(8, 2).setShip();

        this.findPiece(2, 3).setShip();

        this.findPiece(5, 4).setShip();
        this.findPiece(6, 4).setShip();

        this.findPiece(0, 5).setShip();
        this.findPiece(1, 5).setShip();

        this.findPiece(3, 6).setShip();

        this.findPiece(0, 7).setShip();
        this.findPiece(3, 7).setShip();
        
        this.findPiece(3, 8).setShip();

        this.findPiece(6, 9).setShip();
        this.findPiece(7, 9).setShip();
        this.findPiece(8, 9).setShip();
        this.findPiece(9, 9).setShip();
    }

    findPiece(row, column) {
        return this.pieces.find(p => p.row == row && p.column == column);
    }    

    draw() {
        for (const piece of this.pieces) {
            piece.draw(context);
        }
    }

    cursorClick(x, y) {
        for (let piece of this.pieces) {
            let hit = piece.startX < x && x < piece.startX + piece.side && piece.startY < y && y < piece.startY + piece.side;
            if (hit) {
                piece.toggle();
                this.draw();
                break;
            }
        }
    }
}