//  Create a list that holds all cards
let cardsImages = [
    'fa-anchor',
    'fa-anchor',
    'fa-bicycle',
    'fa-bicycle',
    'fa-bolt',
    'fa-bolt',
    'fa-bomb',
    'fa-bomb',
    'fa-cube',
    'fa-cube',
    'fa-gem',
    'fa-gem',
    'fa-leaf',
    'fa-leaf',
    'fa-paper-plane',
    'fa-paper-plane'
];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


// Generate Cards
// Some inspiration from https://www.youtube.com/watch?v=_rUH-sEs68Y
let cards = 16;
const cardsContainer = document.querySelector('.deck');

function cardsTemplate(img) {
    return `<li class="card"><i class="fa ${img}"></i></li>`;
}

function generateCards(cards) {
    cardsImages = shuffle(cardsImages);
    let cardsHTML = cardsImages.slice(0, cards).map(function (img) {
        return cardsTemplate(img);
    });

    cardsContainer.innerHTML = cardsHTML.join('');
}

// Generate Stars
let stars = 5;
const starsContainer = document.querySelector('.stars');
const starsTemplate = '<li><i class="fa fa-star"></i></li>';

function generateStars(stars) {
    let starsHTML = starsTemplate.repeat(stars);
    starsContainer.innerHTML = starsHTML;
}

// Generate Hints
let hints = 3;
const hintsContainer = document.querySelector('.hints');
const hintsTemplate = '<li><i class="fa fa-lightbulb"></i></li>';

function generateHints(hints) {
    let hintsHTML = hintsTemplate.repeat(hints);
    hintsContainer.innerHTML = hintsHTML;
}


// Add Timer
// Some inspiration from https://stackoverflow.com/q/20618355
let seconds = 0;
let minutes = 0;
let hours = 0;
const timerContainer = document.querySelector('.time');

function padTime(timeUnit) {
    if (timeUnit < 10) {
        timeUnit = '0' + timeUnit;
    }
    return timeUnit;
}

function setTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    timerContainer.textContent = padTime(hours) + ':' + padTime(minutes) + ':' + padTime(seconds);
}

let timer = null;

function startTime() {
    timer = setInterval(setTime, 1000);
}

function stopTime() {
    clearInterval(timer);
}


// Show Cards for 5 seconds
function showCards() {
    document.querySelectorAll('.card').forEach(function (card) {
        card.classList.add('open', 'show');
    });
    setTimeout(function () {
        document.querySelectorAll('.card').forEach(function (card) {
            card.classList.remove('open', 'show');
        });
    }, 5000);
}


// Count Moves
let moves = 0;
const movesContainer = document.querySelector('.moves');

function generateMoves() {
    movesContainer.innerHTML = moves;
}

function addMove() {
    moves++;
    movesContainer.textContent = moves;
}


// Flip Card
function flipCards(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}


// Check if Cards Match
let openCards = [];

function matchCards(selectedCards) {
    if (selectedCards[0].firstElementChild.className === selectedCards[1].firstElementChild.className) {
        selectedCards[0].classList.toggle('match');
        selectedCards[1].classList.toggle('match');
        openCards = [];
        gainLive()
    } else {
        setTimeout(function () {
            flipCards(selectedCards[0]);
            flipCards(selectedCards[1]);
            openCards = [];
        }, 1000);
        loseLive();
    }
}


// Add Star for matching cards n times in a row
let pairs = cards / 2;
let matched = 0;
let matchedRow = 0;
let minMatch = 3;

function gainLive() {
    matched++;
    matchedRow++;
    if (matchedRow === minMatch) {
        stars++;
        let starsList = Array.prototype.slice.call(document.querySelectorAll('.fa-star'));
        for (let i = 0; i < starsList.length; i++) {
            if (starsList[i].classList.contains('lost')) {
                starsList[i].classList.toggle('lost');
                break;
            }
        };
        matchedRow = 0;
    }
    if (pairs === matched) {
        // TODO: Game won
        console.log('Game won');
    }
}


// Remove star for not matching cards
function loseLive() {
    stars--;
    matchedRow = 0;
    let starsList = Array.prototype.slice.call(document.querySelectorAll('.fa-star'));
    for (let i = starsList.length - 1; i >= 0; i--) {
        if (!starsList[i].classList.contains('lost')) {
            starsList[i].classList.toggle('lost');
            break;
        }
    }
    if (stars === 0) {
        // TODO: Game over
        console.log('Game over');
    }
}


// Give Hints
// Random card selection logic from https://stackoverflow.com/a/4550514
function giveHint() {
    if (hints >= 1) {
        let unmatchedCards = Array.prototype.slice.call(document.querySelectorAll('li.card:not(.match)'));
        let randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
        flipCards(randomCard);
        setTimeout(function () {
            flipCards(randomCard);
        }, 1000);
        removeHint();
    }
}

function removeHint() {
    hints--;
    let hintsList = Array.prototype.slice.call(document.querySelectorAll('.fa-lightbulb'));
    for (let i = hintsList.length - 1; i >= 0; i--) {
        if (!hintsList[i].classList.contains('used')) {
            hintsList[i].classList.toggle('used');
            break;
        }
    }
}


// Cards interactivity
cardsContainer.addEventListener('click', function (e) {
    const clickTarget = event.target;
    if (clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        (openCards.length < 2) &&
        !openCards.includes(clickTarget)
    ) {
        flipCards(clickTarget);
        openCards.push(clickTarget);
        if (openCards.length === 2) {
            matchCards(openCards);
            addMove();
        }
    }
});


// Hint interactivity
hintsContainer.addEventListener('click', function () {
    giveHint();
});


// Reset game
const restartContainer = document.querySelector('.restart');
restartContainer.addEventListener('click', function () {
    cards = 16;
    stars = 5;
    hints = 3;
    seconds = 0;
    minutes = 0;
    hours = 0;
    moves = 0;
    matched = 0;
    matchedRow = 0;
    minMatch = 3;
    stopTime();
    startGame();
})

// Initiate the game
function startGame() {
    generateCards(cards);
    generateStars(stars);
    generateHints(hints);
    generateMoves();
    startTime();
    showCards();
}

startGame()