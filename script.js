let gameBox = document.querySelector(".gameBox");
let gridSize;
const audio = new Audio('moveSound.mp3');

// Preload the audio
audio.preload = 'auto';

function playSoundEffect() {
    audio.currentTime = 0; // Reset the audio to the beginning
    audio.play();
}

function initializeGameGrid(size) {
    const totalCells = size * size;
    return Array.from({ length: totalCells - 1 }, (_, index) => ({
        id: index,
        color: "#ffffa5",
        text: (index + 1).toString(),
        class: "",
        number: index
    })).concat({
        id: totalCells - 1,
        color: "#95b59c",
        text: "",
        class: "",
        number: totalCells -1
    });
}

let arr = [];

function renderGameGrid(size) {
    gameBox.style.gridTemplateColumns = `repeat(${size}, 70px)`;
    gameBox.style.gridTemplateRows = `repeat(${size}, 70px)`;
    gameBox.innerHTML = "";
    arr.forEach((obj) => {
        const gridElement = document.createElement("div");
        gridElement.className = `grid ${obj.class}`;
        gridElement.id = obj.id;
        gridElement.style.backgroundColor = obj.color;
        gridElement.textContent = obj.text;
        gameBox.appendChild(gridElement);
    });
    playSoundEffect();
}

const swipeArea = document.querySelector('.gameBox');
let startX;
let startY;

swipeArea.addEventListener('touchstart', handleTouchStart);
swipeArea.addEventListener('touchmove', handleTouchMove);

function handleTouchStart(event) {
    // Prevent default to avoid unintended scrolling
    event.preventDefault();

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    // Prevent default to avoid unintended scrolling
    event.preventDefault();

    let position = arr.find(element => element.text === "").id;

    let up = position - gridSize;
    let down = position + gridSize;

    if (!startX || !startY) {
        return;
    }

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    // Calculate the absolute differences
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Compare the absolute differences to determine the primary direction
    if (resume) {
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0 && isRightValid(position, position + 1, gridSize)) {  // Swipe right
                swapAndUpdate(position, position + 1);
            }
            else if (deltaX < 0 && isLeftValid(position, position - 1, gridSize)) { // Swipe left
                swapAndUpdate(position, position - 1);
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && down >= 0 && down <= arr.length) {  // Swipe down
                swapAndUpdate(position, down);
            }
            else if (deltaY < 0 && up >= 0 && up <= arr.length) {  // Swipe Up
                swapAndUpdate(position, up);
            }
        }
    }

    // Reset startX and startY to prevent continuous detection
    startX = null;
    startY = null;
}

function swapAndUpdate(currentPosition, targetPosition) {

    if (!arr[currentPosition] || !arr[targetPosition]) {
        return; // Invalid positions
    }

    let temp = arr[currentPosition];
    arr[currentPosition] = arr[targetPosition];
    arr[targetPosition] = temp;

    // Update the ids and trigger reflow for the transition to take effect
    arr[currentPosition].id = currentPosition;
    arr[targetPosition].id = targetPosition;

    renderGameGrid(gridSize);
    counter++;
    counterBox.textContent = counter;
    if (!timerStarted) {
        seconds = 0;
        startTimer();
        timerStarted = true;
    }

    //  Victory Check

    checkVictory();
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const position = arr.findIndex(element => element.text === "");
    if (position === -1) {
        return; // No empty space found
    }

    const up = position - gridSize;
    const down = position + gridSize;
    const left = position - 1;
    const right = position + 1;

    if (event.key === 'ArrowUp' && up >= 0 && up < arr.length) {
        swapAndUpdate(position, up);
    } else if (event.key === 'ArrowDown' && down >= 0 && down < arr.length) {
        swapAndUpdate(position, down);
    } else if (event.key === 'ArrowLeft' && isLeftValid(position, left, gridSize)) {
        swapAndUpdate(position, left);
    } else if (event.key === 'ArrowRight' && isRightValid(position, right, gridSize)) {
        swapAndUpdate(position, right);
    }
}

function isRightValid(position, right, size) {
    return right >= 0 && right < size * size && position % size !== size - 1;
}

function isLeftValid(position, left, size) {
    return left >= 0 && left < size * size && position % size !== 0;
}

// Function to shuffle the elements in the array

function shuffleArray() {
    let moves = [{key: 'ArrowUp'},{key: 'ArrowDown'},{key: 'ArrowLeft'},{key: 'ArrowRight'}];
    function getRandomElementFromArray(moves) {
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }
    for(let i =0; i<1000; ++i){
        handleKeyPress2(getRandomElementFromArray(moves));
    }
}

function handleKeyPress2(event) {
    const position = arr.findIndex(element => element.text === "");
    if (position === -1) {
        return; // No empty space found
    }

    const up = position - gridSize;
    const down = position + gridSize;
    const left = position - 1;
    const right = position + 1;

    if (event.key === 'ArrowUp' && up >= 0 && up < arr.length) {
        swapAndUpdate2(position, up);
    } else if (event.key === 'ArrowDown' && down >= 0 && down < arr.length) {
        swapAndUpdate2(position, down);
    } else if (event.key === 'ArrowLeft' && isLeftValid(position, left, gridSize)) {
        swapAndUpdate2(position, left);
    } else if (event.key === 'ArrowRight' && isRightValid(position, right, gridSize)) {
        swapAndUpdate2(position, right);
    }
}

function swapAndUpdate2(currentPosition, targetPosition) {

    if (!arr[currentPosition] || !arr[targetPosition]) {
        return; // Invalid positions
    }

    let temp = arr[currentPosition];
    arr[currentPosition] = arr[targetPosition];
    arr[targetPosition] = temp;

    // Update the ids and trigger reflow for the transition to take effect
    arr[currentPosition].id = currentPosition;
    arr[targetPosition].id = targetPosition;

    renderGameGrid(gridSize);
}

// Instructions 
var instructionsBox = document.querySelector(".instruction");
var play = document.querySelector("#play");

// Timer

let timerStarted = false;

let resume = true;

let time = document.querySelector("#time");

let timerBtn = document.querySelector("#timerBtn");

let timer;

let seconds;

function startTimer() {
    timer = setInterval(() => {
        if (resume) {
            seconds++;
            time.textContent = seconds + " s";
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    resume = false;
    console.log("Timer paused");
}

function resumeTimer() {
    startTimer();
    resume = true;
    console.log("Timer resumed");
}

function toggleTimer() {
    if (resume) {
        pauseTimer();
        timerBtn.textContent = "RESUME";
    } else {
        resumeTimer();
        timerBtn.textContent = "PAUSE";
    }
}

// Counter

let counter = 0;

var counterBox = document.querySelector("#count");


// Victory
function victory() {
    // Assuming there is a parent element to append the popup
    let parentElement = document.body; // Change this to the actual parent element

    // Append the popup to the parent element
    parentElement.appendChild(createPopup());

    setTimeout(function () {
        document.getElementById('popupContent').style.opacity = '1';
        document.getElementById('popupContent').style.transform = 'scale(1)';
    }, 10);
}

function closePopup() {
    let popupContainer = document.getElementById('popupContainer');
    let popupContent = document.getElementById('popupContent');

    if (popupContainer) {
        popupContent.style.opacity = '0';
        popupContent.style.transform = 'scale(0.8)';

        setTimeout(function () {
            popupContainer.parentNode.removeChild(popupContainer);
        }, 300);
    }
}

function createPopup() {
    let popup = document.createElement('div');
    popup.id = "popupContainer";
    popup.innerHTML = `
        <div id="popupContent">
            <h1>Victory! 🎉</h1>
            <p>Time taken: <span id="victoryTime">${seconds} seconds</span></p>
            <p>Moves: <span id="victoryMoves">${counter}</span></p>
            <button onclick="beginGame(); closePopup()">Play Again</button>
        </div>`;

    return popup;
}


//  Victory Check

function checkVictory() {
    let isVictory = arr.every((element) => {
        return element.id === element.number;
    });

    if (isVictory) {
        let index = best.find(element => element.size === gridSize);
        if (index.best > seconds) {
            index.best = seconds;
            updateBest(best);
            bestTime.innerHTML = index.best;
            console.log("Updated best time:", best);
        } else if(index.best === 0) {
            index.best = seconds;
            updateBest(best);
            bestTime.innerHTML = index.best;
            console.log("Updated best time:", best);
        }
        victory();
    }
}

// Best Score

// Initialize cart from localStorage
localStorage.setItem('best', 0)
let best = JSON.parse(localStorage.getItem('best')) || [];

best = [
    {
        best: 0,
        size: 3
    },
    {
        best: 0,
        size: 4
    },
    {
        best: 0,
        size: 5
    }
]

updateBest(best);

function updateBest(newBest) {
    best = newBest;
    localStorage.setItem('best', JSON.stringify(best));
}

let bestTime = document.querySelector("#bestTime");


// Begin Game

function beginGame() {
    document.querySelector('.instruction').classList.toggle("display");
    const gridSizeInput = document.querySelector('input[name="grid"]:checked');
    gridSize = parseInt(gridSizeInput.value);
    arr = initializeGameGrid(gridSize);
    shuffleArray();
    renderGameGrid(gridSize);
    clearInterval(timer);
    time.textContent =  "0 s";
    timerStarted = false;
    bestTime.innerHTML = best.find(element => element.size === gridSize).best;
    counter = 0;
    counterBox.textContent = counter;
}

