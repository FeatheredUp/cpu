// returns a whole number between min and max (both inclusive).  I.e. what 'pick a number between 1 and 10' means.
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class Branch {
    operation;
    endValue;
    midValue;
    constructor(operation, endValue, midValue) {
        this.operation = operation;
        this.endValue = endValue;
        this.midValue = midValue;
    }
}

class Concept {
    target;
    branch = [];

    constructor() {
        const multipleSource = getRandomValue(4, 12);
        const multiple = getRandomValue(4, 12);

        const target = multipleSource * multiple;

        const division = getRandomValue(2, 7);
        const divisionSource = target * division;

        const sumSource = getRandomValue(1, target - 1);
        const sum = target - sumSource;

        const subtract = getRandomValue(7, 90);
        const subtractSource = target + subtract;

        // checks until I'm completely positive...
        // this.checkEqual(target, multipleSource * multiple, multipleSource + " * " + multiple);
        // this.checkEqual(target, divisionSource / division, divisionSource + " / " + division);
        // this.checkEqual(target, sumSource + sum, sumSource + " + " + sum);
        // this.checkEqual(target, subtractSource - subtract, subtractSource + " - " + subtract);

        this.branch.push(new Branch('+', sumSource, sum));
        this.branch.push(new Branch('-', subtractSource, subtract));
        this.branch.push(new Branch('*', multipleSource, multiple));
        this.branch.push(new Branch('/', divisionSource, division));
        shuffleArray(this.branch);

        this.target = target;

    }

    checkEqual(expected, actual, desc) {
        if (expected != actual) alert(desc + " should be " + expected + " but is " + actual);
    }
}

const ringType_Centre = 0;
const ringType_Connector = 1;
const ringType_End = 2;

class Board { 
    pieces = [];
    constructor() {
        const concept = new Concept();
        this.pieces.push(new Piece('centre', 500, 500, ringType_Centre, concept.target, null));

        this.pieces.push(new Piece('1a', 100, 150, ringType_End, concept.branch[0].endValue, '1b'));
        this.pieces.push(new Piece('1b', 300, 50, ringType_Connector, concept.branch[0].midValue, 'centre'));

        this.pieces.push(new Piece('2a', 800, 200, ringType_End, concept.branch[1].endValue, '2b'));
        this.pieces.push(new Piece('2b', 680, 300, ringType_Connector, concept.branch[1].midValue, 'centre'));

        this.pieces.push(new Piece('3a', 50, 700, ringType_End, concept.branch[2].endValue, '3b'));
        this.pieces.push(new Piece('3b', 200, 600, ringType_Connector, concept.branch[2].midValue, 'centre'));

        this.pieces.push(new Piece('4a', 700, 600, ringType_End, concept.branch[3].endValue, '4b'));
        this.pieces.push(new Piece('4b', 570, 750, ringType_Connector, concept.branch[3].midValue, 'centre'));
    }
}

class Piece {
    id;
    value;
    cx;
    cy;
    ringType;
    connectTo;

    constructor(id, cx, cy,ringType, value, connectTo) {
        this.id = id;
        this.cx = cx;
        this.cy = cy;
        this.ringType = ringType;
        this.value = value;
        this.connectTo = connectTo;
    }
}