// Card state
let firstCard = null;
let secondCard = null;
let isChecking = false;

// Game state
let matchesFound = 0;
let attempts = 0;
let gameStartTime = null;
let gameTimerInterval = null;

// Card types
const cardTypes = [
    { symbol: 'A', color: '#FF6666' },
    { symbol: 'B', color: '#FFCC66' },
    { symbol: 'C', color: '#66CC66' },
    { symbol: 'D', color: '#66CCCC' },
    { symbol: 'E', color: '#6666CC' },
    { symbol: 'F', color: '#CC66CC' },
];

const playAgainBtn = document.getElementById('play-again-btn');
playAgainBtn.onclick = () => {
    document.getElementById('game-board').innerHTML = ''; // Clear the board
    playAgainBtn.style.display = 'none'; // Hide the button

    // Reset game state variables
    matchesFound = 0;
    attempts = 0;
    gameStartTime = new Date();

    initializeGame(document.getElementById('game-board')); // Restart the game
};



document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById('game-board');
    initializeGame(gameBoard);
});

function initializeGame(board) {
    let cards = cardTypes.concat(cardTypes); // Create larger array with pairs
    cards = shuffle(cards); // Shuffle the array

    cards.forEach((card, index) => {
        const newCard = createCard(card, index);
        board.appendChild(newCard);
    });

    gameStartTime = new Date();
    if (gameTimerInterval) clearInterval(gameTimerInterval);
    gameTimerInterval = setInterval(updateGameTimer, 1000);
}

function createCard(cardType, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = cardType.symbol;
    card.dataset.index = index;
    card.style.backgroundColor = cardType.color;

    // Create the front and back of the card
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = cardType.symbol;

    card.appendChild(cardBack);
    card.appendChild(cardFront);

    // Add event listener for card click
    card.addEventListener('click', () => {
        cardClicked(card);
    });

    return card;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}


function cardClicked(card) {

    console.log(`Card clicked: Symbol=${card.dataset.symbol}, Index=${card.dataset.index}`);
    if (isChecking || card === firstCard || card.classList.contains('flipped')) {
        return;
    }

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkForMatch();
    }
}

function checkForMatch() {
    isChecking = true;
    attempts++;


    let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
        matchesFound++;
        if (matchesFound === cardTypes.length) {
            gameOver();
        }
        resetCards();
    } else {
        // If not a match, flip them back after a 1 sec delay
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    [firstCard, secondCard, isChecking] = [null, null, false];
}

function updateGameTimer() {
    const currentTime = new Date();
    const timeElapsed = new Date(currentTime - gameStartTime);
}

function gameOver() {
    setTimeout(() => {
        clearInterval(gameTimerInterval);

        const totalTime = new Date(new Date() - gameStartTime);
        alert(`You Win! Time taken: ${totalTime.toISOString().slice(11, 19)} -- Attempts: ${attempts}`);

        playAgainBtn.style.display = 'block'; // Show the Play Again button
    }, 700); // Delay by 700ms so card animation can finish first
}
