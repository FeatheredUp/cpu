CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    return this;
}

class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    convertFromPageToCanvas(canvas) {
        return new Point( this.x - (canvas.offsetLeft + canvas.clientLeft), this.y - (canvas.offsetTop + canvas.clientTop));
    }
}

class Piece {
    centre;
    letter;
    constructor(letter, centre) {
        this.centre = centre;
        this.letter = letter;
    }

    draw(context, radius) {
        context.beginPath();
        context.roundRect(this.centre.x - radius, this.centre.y - radius, 2 * radius, 2 * radius, 12);
        context.closePath();
        context.stroke();

        context.fillText(this.letter, this.centre.x, this.centre.y);
    }
}

class Board {
    radius = 30;
    pieces = [];
    canvas = null;
    context = null;
    imageData = null;
    originalImageData = null;
    lastLockPoint = null;
    selectedPieces = [];
    pointerId = null;
    validWords = [];

    constructor(letters, canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.font = '20px Verdana, sans-serif';

        for (const letter of letters) {
            const centre = this.getCentre(this.pieces.length);
            const piece = new Piece(letter, centre);
            this.pieces.push(piece);
        }

        var letters = this.getAllLetters();
        this.findPermutations(letters);
    }

    findPiece(pt) {
        for (const piece of this.pieces) {
            if (piece.centre.x - this.radius <= pt.x && pt.x <= piece.centre.x + this.radius && 
                piece.centre.y - this.radius <= pt.y && pt.y <= piece.centre.y + this.radius) {
                    return piece;
            }
        }
        return null;
    }

    draw() {
        for (const piece of this.pieces) {
            piece.draw(this.context, this.radius);
        }
    }

    getCentre(pos) {
        if (pos === 0) return new Point(300, 300);
        if (pos === 1) return new Point(200, 380);
        if (pos === 2) return new Point(400, 380);
        if (pos === 3) return new Point(200, 480);
        if (pos === 4) return new Point(400, 480);
        if (pos === 5) return new Point(300, 560);
    }

    saveBoard() {
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    
    restoreBoard() {
        this.context.putImageData(this.imageData, 0, 0);
    }

    pointerDown(clientPoint, pointerId) {
        this.originalImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.saveBoard();
    
        const pt = clientPoint.convertFromPageToCanvas(c);
    
        this.pointerId = pointerId;
        this.lastLockPoint = null;
        this.selectedPieces = [];
    
        this.touchPoint(pt);
    }

    pointerMove(clientPoint, pointerId) {
        if (pointerId == this.pointerId) {
            // continuation of move
            this.restoreBoard();
            const pt = clientPoint.convertFromPageToCanvas(c);
            // temporary line
            if (this.lastLockPoint!=null) {
                this.drawLine(this.lastLockPoint, pt, 'black', 1);
            }
    
            this.touchPoint(pt);
        }
    }

    pointerUp() {
        const word = this.getCurrentWord().toLowerCase();
        if (this.checkWord(word)) {
            alert('VALID');
        } else{
            alert('BAD WORD');
        }
        this.resetBoard();
        this.pointerId = null;
    }

    pointerCancel() {
        this.resetBoard();
    }
    
    touchPoint(pt) {
        const piece = this.findPiece(pt);
    
        if (piece) {
            // if it's already in the list, abort
            if (this.selectedPieces.includes(piece)) return;
    
            this.restoreBoard();
    
            const newLockPoint = piece.centre;
            //Draw permanent line from last touchpoint
            if (this.lastLockPoint != null) {
                this.drawLine(this.lastLockPoint, newLockPoint, 'red', 4);
            }
    
            this.lastLockPoint = newLockPoint;
            this.selectedPieces.push(piece);
            this.displayCurrentWord();
            this.saveBoard();
        }
    }

    drawLine(start, end, colour, thickness) {
        this.context.strokeStyle = colour;
        this.context.lineWidth = thickness;
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
    }

    getCurrentWord() {
        let word = "";
        for (const piece of this.selectedPieces) {
            word += piece.letter;
        }
        return word;
    }

    displayCurrentWord() {
        const word = this.getCurrentWord();
        if (word == "") return;

        this.context.strokeStyle = 'black';
        this.context.fillStyle = 'white';
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.roundRect(200, 200, 200, 50, 12);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        this.context.fillStyle = 'black';
        this.context.fillText(word, 300, 225);
    }
    
    resetBoard() {
        if (this.originalImageData != null) this.context.putImageData(this.originalImageData, 0, 0);
        this.pointerId = null;
        this.lastLockPoint = null;
        this.selectedPieces = [];
    
        this.displayCurrentWord(this.selectedPieces);
    }

    checkWord(word) {
        const list = this.getWordList(word.length);
        if (list == null) return false;
        return list.includes(word.toLowerCase());
    }

    getWordList(length) {
        if (length == 3) return words3;
        if (length == 4) return words4;
        if (length == 5) return words5;
        if (length == 6) return words6;
        if (length == 7) return words7;
        return null;
    }

    getAllLetters() {
        let letters = "";
        for (const piece of this.pieces) {
            letters += piece.letter;
        }
        return letters;
    }
    
    findPermutations(string) {
        let permutationsArray = []

        if (string.length < 2) {
            permutationsArray.push(string);
            return permutationsArray;
        }

        for (let i = 0; i < string.length; i++) {
            let char = string[i]

            if (string.indexOf(char) != i)
                continue

            let remainingChars = string.slice(0, i) + string.slice(i + 1, string.length)
            let permutations = this.findPermutations(remainingChars);
            permutationsArray.push(...permutations);

            for (let permutation of permutations) {
                const possibleWord = char + permutation;
                permutationsArray.push(possibleWord);
                if (!this.validWords.includes(possibleWord) && this.checkWord(possibleWord)) {
                    this.validWords.push(possibleWord);
                }
            }
        }

        return permutationsArray;
    }

    getAllWords() {
        this.validWords.sort((a, b) => b.length - a.length ||  a.localeCompare(b));
        var debug = document.getElementById('debug');
        debug.innerHTML = `${this.validWords.length} word found<br>`;
        for (const word of this.validWords) {
            debug.innerHTML += word + '<br>';
        }
    }
}

const c = document.getElementsByTagName('canvas')[0];
let board = new Board("ORSTNE", c);
board.draw();

c.addEventListener("pointerdown", handlePointerDown, false);
c.addEventListener("pointerup", handlePointerUp, false);
c.addEventListener("pointermove", handlePointerMove, false);
c.addEventListener("pointercancel", handlePointerCancel, false);
c.addEventListener("pointerout", handlePointerCancel, false);
c.addEventListener("pointerleave", handlePointerCancel, false);
document.getElementById('findButton').addEventListener('click', handleFindClick, false);

function handlePointerDown(evt) {
    if (!evt.isPrimary) return;
    board.pointerDown(new Point(evt.clientX, evt.clientY), evt.pointerId);
}

function handlePointerMove(evt) {
    if (!evt.isPrimary) return;
    board.pointerMove(new Point(evt.clientX, evt.clientY), evt.pointerId);
}

function handlePointerUp(evt) {
    board.pointerUp();
}

function handlePointerCancel(evt) {
    board.pointerCancel();
}

function handleFindClick(evt) {
    board.getAllWords();
}