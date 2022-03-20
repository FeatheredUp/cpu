
// const canvas = document.getElementById('canvas');
// const context = canvas.getContext('2d');
// const img = new Image();   
// img.src = '../images/terminal border.png'; 
// img.addEventListener('load', function() { 
//     context.drawImage(img,0,0);
// }, false);


let insertedText = document.getElementById('insertedText');
let previousText = document.getElementById("previousText");
let printing = false;
let receiveEnteredText = null;

/* Receive input */
function bodyKeypress(event) {
    if (printing) return;
    let key = event.key;

    if (key == 'Backspace') {
        insertedText.innerText = insertedText.innerText.substring(0, insertedText.innerText.length - 1);
    } else if (key == 'Enter') {
        receiveEnteredText();
    } else {
        insertedText.innerText += extraInput(key);
    }
}

function extraInput(key) {
    if ((/^[a-zA-Z ]$/).test(key)) {
        return key;
    }
    return '';
}

function hideInputLine() {
    document.getElementById('inputLine').classList.add('hidden');
}

function showInputLine() {
    document.getElementById('inputLine').classList.remove('hidden');
}

document.addEventListener('keydown', function(event) { bodyKeypress(event);}, false);

function receiveName() {
    const name = insertedText.innerText;
    if (name == '') {
        displayInvalidName();
    } else {
        displaySecondMessage(insertedText.innerText);
    }
}

function receivePasswordAnswer() {

}

/* Display computer output */

function displayLetter(display, index) {
    let next = display[index];
    previousText.innerHTML += next.letter;
    index += 1;
    if (index < display.length) {
        setTimeout(displayLetter, next.speed, display, index);
    } else {
        showInputLine();
        printing = false;
    }
}

function printLetterByLetter(display) {
    printing = true;
    hideInputLine();
    displayLetter(display, 0);
}

let toDisplay = [];

function resetInput() {
    insertedText.innerText = '';
    toDisplay = [];
}

function addToInput(text, speed) {
   for (ch of text) {
        let toAdd = ch;
        if (toAdd == '|') toAdd = '<br />';
        toDisplay.push( {letter: toAdd, speed: speed});
   }
}

const instantSpeed = 0;
const defaultSpeed = 50;
const pauseSpeed = 300;
const bootingSpeed = 200;
function displayIntroduction() {
    resetInput();
    addToInput('Initialising CPU Operation port Drive G:-UI;<SE>.exe|', defaultSpeed);
    addToInput('Auto-Detecting BIOS Extension|', defaultSpeed);
    addToInput('|', defaultSpeed);
    addToInput('Detected [1] User - Serial: #K11-[1]-3R Class <BioMech> - Unregistered|', defaultSpeed);
    addToInput('Assigning Port Control Protocol', defaultSpeed);
    addToInput(' : ', pauseSpeed);
    addToInput('Access Denied|', defaultSpeed);
    addToInput('Adaptech Configuration - Port Authority', defaultSpeed);
    addToInput(' : ', pauseSpeed);
    addToInput('Access Denied|', defaultSpeed);
    addToInput('Adaptech Protocol JD1G ', defaultSpeed);
    addToInput(' : ', pauseSpeed);
    addToInput('Partial Access Confirmed|', defaultSpeed);
    addToInput('System Initiate: OS <User Reference>|', defaultSpeed);
    addToInput('|', defaultSpeed);
    addToInput('Booting...|', bootingSpeed);
    addToInput('|', defaultSpeed);
    addToInput('System detected error in <User Identity>|', defaultSpeed);
    addToInput('Previous User data is unretrievable and may be corrupted|', defaultSpeed);
    addToInput('Register New <Username> to continue|', defaultSpeed);

    printLetterByLetter(toDisplay);
    receiveEnteredText = receiveName;
}

function displayInvalidName() {
    resetInput();

    addToInput('> |', instantSpeed);

    addToInput('That is not a valid name.|', defaultSpeed);
    addToInput('Register New <Username> to continue|', defaultSpeed);

    printLetterByLetter(toDisplay);
    receiveEnteredText = receiveName;
}

function displaySecondMessage(name) {
    resetInput();
    addToInput('> ' + name + '|', instantSpeed);

    addToInput('User <' + name + '> initialised.|', defaultSpeed);
    addToInput('|', defaultSpeed);
    addToInput('Confirmation of aptitude required.|', defaultSpeed);
    addToInput('|', defaultSpeed);
    addToInput('Which of these is the least safe password?|', defaultSpeed);
    addToInput('A) Three unrelated words concatanated|', defaultSpeed);
    addToInput('B) A birthdate|', defaultSpeed);
    addToInput('C) A mix of letters, numbers and symbols|', defaultSpeed);

    printLetterByLetter(toDisplay);
    receiveEnteredText = receivePasswordAnswer;
}


displayIntroduction();