/*
TO DO
*) Remove some more of the non-words
*/

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

class Word {
    letters;
    isFound = false;
    energyStore;
    constructor(letters, energyStore) {
        this.letters = letters;
        this.energyStore = energyStore;
    }

    found() {
        this.isFound = true;
        this.energyStore.energy += this.letters.length;
    }
}

class WordList {
    words;
    energy;
    maxLetters;
    playerMax;
    constructor(playerMax) {
        this.words = [];
        this.energy = 0;
        this.maxLetters = 0;
        this.playerMax = playerMax;
    }

    addWord(word) {
        if (this.includes(word)) return;
        this.words.push(new Word(word, this));
        this.maxLetters += word.length;
    }

    findWord(word) {
        return this.words.find(p => p.letters == word);
    }

    includes(word) {
        return this.findWord(word) != null;
    }

    sort() {
        this.words.sort((a, b) => b.letters.length - a.letters.length ||  a.letters.localeCompare(b.letters));
    }

    wordCount(){
        return this.words.length;
    }

    getEnergyPercent() {
        return 100 * this.energy / this.playerMax;
    }
}

class LetterPieces {
    EnterWordResult = {
        ALREADY_SELECTED : 1,
        INVALID : 2,
        VALID: 3
    }

    internalValidWords;

    constructor(letters) {
        this.internalValidWords = new WordList(200);
        Object.freeze(this.EnterWordResult);
        this.internalFindPermutations(letters);
        this.internalValidWords.sort();
    }

    enterWord(possibleWord) {
        const word = this.internalValidWords.findWord(possibleWord);

        if (word == null) {
            return this.EnterWordResult.INVALID;
        }

        if (word.isFound) {
            return this.EnterWordResult.ALREADY_SELECTED;
        }

        word.found();

        return this.EnterWordResult.VALID;
    }
    
    internalFindPermutations(string) {
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
            let permutations = this.internalFindPermutations(remainingChars);
            permutationsArray.push(...permutations);

            for (let permutation of permutations) {
                const possibleWord = char + permutation;
                permutationsArray.push(possibleWord);
                this.internalAddPossibleWord(possibleWord);
            }
        }

        return permutationsArray;
    }

    internalAddPossibleWord(possibleWord) {
        if (!this.internalValidWords.includes(possibleWord) && this.internalCheckWord(possibleWord)) {
            this.internalValidWords.addWord(possibleWord);
        }
    }

    internalCheckWord(word) {
        const list = this.internalGetWordList(word.length);
        if (list == null) return false;
        return list.includes(word.toLowerCase());
    }

    internalGetWordList(length) {
        if (length == 3) return words3;
        if (length == 4) return words4;
        if (length == 5) return words5;
        if (length == 6) return words6;
        if (length == 7) return words7;
        return null;
    }

    getEnergy() {
        return this.internalValidWords.getEnergyPercent();
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
    letterPieces = null;
    energyRequired = 100;
    energyX = 920;
    energyY = 55;
    energyHeight = 400;
    energyWidth = 25;

    constructor(letters, canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.font = '20px Verdana, sans-serif';
        this.whiteBackground();

        for (const letter of letters) {
            const centre = this.getCentre(this.pieces.length);
            const piece = new Piece(letter, centre);
            this.pieces.push(piece);
        }

        this.letterPieces = new LetterPieces(letters);
    }

    whiteBackground() {
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.closePath();
        this.context.fill();
        this.context.fillStyle = 'black';
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
        const imgBorder = loadImage('../images/border.png', main);
        const info = map.getCurrentPageInfo();
        const divisionFromSimplification = Math.pow(2, info.simplifies);
        this.energyRequired /= divisionFromSimplification;

        for (const piece of this.pieces) {
            piece.draw(this.context, this.radius);
        }
        this.context.drawImage(imgBorder, 0, 0);
        this.drawEmptyEnergyBar();
        this.displayUpdatedEnergy();
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    drawEmptyEnergyBar() {
        this.context.strokeStyle = 'black';
        this.context.fillStyle = 'white';
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.rect(this.energyX - 1, this.energyY - 1, this.energyWidth + 2, this.energyHeight + 2);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        let ypos = this.energyY + this.energyHeight;
        this.context.textAlign = "right";
        this.context.font = '10px system-ui';
        this.context.fillStyle = 'black';
        for (let index = 0; index <= 10; index++) {
            this.context.fillText(index * 10, this.energyX - 5, ypos);
            ypos -= 40;
        }
        this.context.textAlign = "center";
    }

    getCentre(pos) {
        if (pos === 0) return new Point(300, 120);
        if (pos === 1) return new Point(200, 200);
        if (pos === 2) return new Point(400, 200);
        if (pos === 3) return new Point(200, 300);
        if (pos === 4) return new Point(400, 300);
        if (pos === 5) return new Point(300, 380);
    }

    saveBoard() {
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    
    restoreBoard() {
        this.context.putImageData(this.imageData, 0, 0);
    }

    pointerDown(clientPoint, pointerId) {
        const pt = clientPoint.convertFromPageToCanvas(c);

        // if (this.isSimplifyButton(pt)) {
        //     this.simplifyGame();
        //     return;
        // }

        this.originalImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.saveBoard();
    
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
        const word = this.getCurrentWord();
        const result = this.letterPieces.enterWord(word);
        if (result == this.letterPieces.EnterWordResult.VALID) {
            this.checkWinCondition();
        }
        this.resetBoard();
        this.displayUpdatedEnergy();
        this.showFoundWords();
        this.pointerId = null;
    }

    checkWinCondition() {
        if (this.letterPieces.getEnergy() >= this.energyRequired) {
            alert ('Congratulations you have found enough words!');
            map.unlockNext();
        }
    }

    pointerCancel() {
        if (this.pointerId == null) return;
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

        this.context.font = '20px Verdana, sans-serif';
        this.context.strokeStyle = 'black';
        this.context.fillStyle = 'white';
        this.context.textAlign = "center";
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.roundRect(200, 25, 200, 50, 12);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        this.context.fillStyle = 'black';
        this.context.fillText(word, 300, 50);
    }
    
    whiteOutArea(startX, startY, width, height) {
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.rect(startX, startY, width, height, 12);
        this.context.closePath();
        this.context.fill();
    }

    displayUpdatedEnergy() {
        // white out energy bar
        this.whiteOutArea(this.energyX, this.energyY, this.energyWidth, this.energyHeight);

        let energy = this.letterPieces.getEnergy();
        if (energy > 100) energy = 100;

        const height = energy * 4;
        const bottom = this.energyY + this.energyHeight;
        const top = bottom - height;

        // the energy itself
        this.context.fillStyle = 'yellow';
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.rect(this.energyX, top, this.energyWidth, height, 12);
        this.context.closePath();
        this.context.fill();

        // Line at the top of the bar
        this.context.strokeStyle = 'black';
        this.context.beginPath();
        this.context.moveTo(this.energyX, this.energyY - 1);
        this.context.lineTo(this.energyX + this.energyWidth, this.energyY - 1);
        this.context.closePath();
        this.context.stroke();

        // line at the top of the energy
        if (energy > 0) {
            this.context.strokeStyle = 'black';
            this.context.beginPath();
            this.context.moveTo(this.energyX, top - 1);
            this.context.lineTo(this.energyX + this.energyWidth, top - 1);
            this.context.closePath();
            this.context.stroke();
        }

        // line at the energy required
        const maxHeight = this.energyRequired * 4;
        const maxPos = bottom - maxHeight;
        this.context.strokeStyle = 'red';
        this.context.beginPath();
        this.context.moveTo(this.energyX, maxPos - 1);
        this.context.lineTo(this.energyX + this.energyWidth, maxPos - 1);
        this.context.closePath();
        this.context.stroke();
    }

    resetBoard() {
        if (this.originalImageData != null) this.context.putImageData(this.originalImageData, 0, 0);
        this.pointerId = null;
        this.lastLockPoint = null;
        this.selectedPieces = [];
    
        this.displayCurrentWord(this.selectedPieces);
    }

    simplifyGame() {
        // Decrease energy required 
        this.energyRequired /= 2;
        // Redraw energy bar
        this.displayUpdatedEnergy();
        // Has player already won?
        this.checkWinCondition();
    }

    showFoundWords() {
        this.whiteOutArea(15, 495, 1000, 1000);

        this.context.textAlign = "left";
        this.context.font = '12px system-ui';
        this.context.fillStyle = 'black';

        let x = 20;
        let y = 500;
        for (const word of this.letterPieces.internalValidWords.words) {
            if (word.isFound) {
                this.context.fillText(word.letters, x, y);
            }
            x += 88;
            if ( x > 930) {
                x = 20;
                y+= 25;
            }
        }
    }
}

const description =  "Find as many anagrams of Nestor's name as you can.  You get half a point of energy for every letter you use.  You can only use each letter once in each word.  Words must be between 3 and 6 letters long.";
const c = document.getElementsByTagName('canvas')[0];
const board = new Board("ORSTNE", c);
const map = new StoryMap(simplifyGame, description);
const imgBorder = loadImage('../images/border.png', main);
const imageCount = 1;

let imagesLoaded = 0;
function main() {
    imagesLoaded += 1;
    if (imagesLoaded == imageCount) {
        c.getContext("2d").drawImage(imgBorder, 0, 0);
        board.draw();
    }
}

function loadImage(src, onload) {
    const img = new Image();
    img.onload = onload;
    img.src = src;
    return img;
}

c.addEventListener("pointerdown", handlePointerDown, false);
c.addEventListener("pointerup", handlePointerUp, false);
c.addEventListener("pointermove", handlePointerMove, false);
c.addEventListener("pointercancel", handlePointerCancel, false);
c.addEventListener("pointerout", handlePointerCancel, false);
c.addEventListener("pointerleave", handlePointerCancel, false);

function simplifyGame() {
    board.simplifyGame();
}

function handlePointerDown(evt) {
    if (!evt.isPrimary) return;
    board.pointerDown(new Point(evt.clientX, evt.clientY), evt.pointerId);
}

function handlePointerMove(evt) {
    if (!evt.isPrimary) return;
    board.pointerMove(new Point(evt.clientX, evt.clientY), evt.pointerId);
}

function handlePointerUp(evt) {
    board.pointerUp(new Point(evt.clientX, evt.clientY), evt.pointerId);
}

function handlePointerCancel(evt) {
    board.pointerCancel();
}