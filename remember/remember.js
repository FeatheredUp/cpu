
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const img = new Image();   
img.src = '../images/busy.jpg'; 
img.addEventListener('load', function() { context.drawImage(img,0,0, 1000, 500);}, false);

let correct = '';
document.getElementById('startButton').addEventListener('click', function() { 
    document.getElementById('initialView').classList.add('hidden');
    document.getElementById('questionView').classList.remove('hidden');
    const chosen = getRandomValue(0, questions.length - 1);
    document.getElementById('question').innerText = questions[chosen].question;

    correct = questions[chosen].answers[0].toLowerCase();
    shuffleArray(questions[chosen].answers)

    let answerSelect = document.getElementById('answers');
    answerSelect.innerHTML = '';
    addOption(answerSelect, '', true);
    for (const answer of questions[chosen].answers) {
        addOption(answerSelect, answer, false);
    }
}, false);

document.getElementById('chosenButton').addEventListener('click', function() {
    if (document.getElementById('answers').value == correct) {
        alert('Congratulations you are right! You can move on.');
    } else{

        alert('No, no, that\'s all wrong!')

        document.getElementById('initialView').classList.remove('hidden');
        document.getElementById('questionView').classList.add('hidden');
    }
}, false);

function addOption(select, itemText, selected) {
    const opt = document.createElement('option');
    opt.text = itemText;
    opt.value = itemText.toLowerCase();
    opt.selected = selected;
    select.add(opt);
}

var questions = [];
questions.push({question: 'What does the painting depict?', answers: ['Guitar', 'Violin', 'Snow scene', 'Red house', 'Castle']});
questions.push({question: 'What is hanging on the arm of the statue?', answers: ['Umbrella', 'Scarf', 'Walking stick', 'Hockey stick', 'Nothing']});
questions.push({question: 'What is hanging on the coat rack?', answers: ['Nothing', 'Coat', 'Hat', 'Tree branch', 'Dog leash']});
questions.push({question: 'What colour is the dog?', answers: ['Black and white', 'Black', 'White', 'Golden', 'Brown']});
questions.push({question: 'How many framed pictures are there on the wall?', answers: ['Three', 'None', 'One', 'Two', 'Four']});
questions.push({question: 'How many shoes are there?', answers: ['One', 'None', 'Two', 'Three', 'Four']});


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

