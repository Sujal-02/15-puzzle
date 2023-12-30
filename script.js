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

function beginGame() {
    document.querySelector('.instruction').classList.toggle("display");
    const gridSizeInput = document.querySelector('input[name="grid"]:checked');
    gridSize = parseInt(gridSizeInput.value);
    arr = shuffleSolvableArray(initializeGameGrid(gridSize));
    renderGameGrid(gridSize);
    clearInterval(timer);
    time.textContent =  "0 s";
    timerStarted = false;
    bestTime.innerHTML = best;
    counter = 0;
    counterBox.textContent = counter;
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
    const position = arr.find(element => element.text === "").id;
    const up = position - gridSize;
    const down = position + gridSize;
    const left = position - 1;
    const right = position + 1;

    if (event.key === 'ArrowUp' && up >= 0 && up <= arr.length) {
        swapAndUpdate(position, up);
    } else if (event.key === 'ArrowDown' && down >= 0 && down <= arr.length) {
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


function isSolvable(arr) {
    function countInversions(arr) {
        let inversions = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].text == 0) continue; // Skip empty space
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i].text > arr[j].text && arr[j].text != 0) {
                    inversions++;
                }
            }
        }
        return inversions;
    }

    const inversions = countInversions(arr);

    // Check solvability condition
    if (gridSize % 2 === 1) {
        // For odd-sized puzzles
        return inversions % 2 === 0;
    } else {
        // For even-sized puzzles
        const emptySpaceRow = Math.floor(arr.findIndex((element) => element.number === 0) / gridSize);
        const emptySpaceRowFromBottom = gridSize - emptySpaceRow;

        if (gridSize % 2 === 0 && emptySpaceRowFromBottom % 2 === 0) {
            return inversions % 2 === 0;
        } else if (gridSize % 2 === 0 && emptySpaceRowFromBottom % 2 === 1) {
            return inversions % 2 === 1;
        } else {
            return (inversions + emptySpaceRow) % 2 === 0;
        }
    }
}


function shuffleSolvableArray(arr) {
    let solvable = false;
    let shuffledArray;

    while (!solvable) {
        shuffledArray = shuffleArray(arr);
        solvable = isSolvable(shuffledArray);
    }

    return shuffledArray;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        [array[i], array[j]] = [array[j], array[i]];
        // Update ids to be the indices
        array[i].id = i;
        array[j].id = j;
    }
    return array;
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
        if (best > seconds) {
            best = seconds;
            updateBest(best);
            bestTime.innerHTML = best;
            console.log("Updated best time:", best);
        } else if(best === 0) {
            best = seconds;
            updateBest(best);
            bestTime.innerHTML = best;
            console.log("Updated best time:", best);
        }
        victory();
    }
    console.log(isVictory);
}

// Best Score

// Initialize cart from localStorage
// localStorage.setItem('best', 0)
let best = JSON.parse(localStorage.getItem('best')) || 0;

console.log(best);

function updateBest(newBest) {
    best = newBest;
    localStorage.setItem('best', JSON.stringify(best));
}

function getBest() {
    return best;
}

function clearCart() {
    best = 0;
    updatebest(best);
}

let bestTime = document.querySelector("#bestTime");

