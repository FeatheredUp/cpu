
const disconnectSound = new Audio('../sounds/disconnect.mp3');
const ringingSound = new Audio('../sounds/calling.mp3');
const beepSound = new Audio('../sounds/beep.mp3');

function digitPressed(ctrl) {
    let display = document.getElementById('display');
    const which = ctrl.innerText;
    if (display.innerText.length < 8) {
        beepSound.play();
        display.innerText += which;
    }
}

function backPressed() {
    const display = document.getElementById('display');
    if (display.innerText.length > 0) {
        display.innerText = display.innerText.substring(0, display.innerText.length - 1);
    }
}

function dialPressed() {
    const display = document.getElementById('display');
    if (display.innerText.length < 8) {
        disconnectSound.play();
    }
    else {
        ringingSound.play();
        document.getElementById('phone').classList.add('hidden');
        document.getElementById('ringingPhone').classList.remove('hidden');

        ringingSound.addEventListener('ended',function() {showNextScene();}, false);
    }
}

function showNextScene() {
    document.getElementById('ringingPhone').classList.add('hidden');
    document.getElementById('nextScene').classList.remove('hidden');
}

const digits = document.getElementsByClassName('digit');
for (const digit of digits) {
    digit.addEventListener('click', function(event) {
        digitPressed(event.currentTarget);
    }, false);
};

document.getElementById('back').addEventListener('click', function(event) {
    backPressed();
}, false);

document.getElementById('dial').addEventListener('click', function(event) {
    dialPressed();
}, false);