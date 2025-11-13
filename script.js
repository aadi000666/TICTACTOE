const statusDisplay = document.querySelector('.status-display');
const cells = document.querySelectorAll('.cell');
const startButton = document.querySelector('#start-button');
const newGameButton = document.querySelector('#new-game-button');
const startScreen = document.querySelector('#start-screen');
const gameArea = document.querySelector('#game-area');

let gameActive = false;
let currentPlayer = 'A';
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameMode = 'pvp';

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];


const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game khatam hu!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;



function startGame() {
    gameMode = document.querySelector('input[name="gameMode"]:checked').value;
    gameActive = true;
    currentPlayer = "A";
    boardState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('A', 'Z');
    });
    startScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = currentPlayer === "A" ? "Z" : "A";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function checkResult() {
    let roundWon = false;
    for (const winCondition of winningConditions) {
        const [a, b, c] = winCondition.map(index => boardState[index]);
        if (a && a === b && a === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    if (!boardState.includes("")) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    changePlayer();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (boardState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    checkResult();
    
    
    if (gameActive && gameMode === 'pva' && currentPlayer === 'Z') {

        setTimeout(aiMove, 500);
    }

}
// for AI move
function aiMove() {
    if (!gameActive) return;

    let bestMove = findBestMove();
    
    if (bestMove !== -1) {
        const cellToPlay = document.querySelector(`.cell[data-cell-index='${bestMove}']`);
        handleCellPlayed(cellToPlay, bestMove);
        checkResult();
    }
}

function findBestMove() {
    // Offensive Move
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
            boardState[i] = 'Z'; 
            if (isWinner('Z')) {
                boardState[i] = ""; 
                return i;
            }
            boardState[i] = ""; 
        }
    }
    // Defensive Move
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
            boardState[i] = 'A'; 
            if (isWinner('A')) {
                boardState[i] = ""; 
                return i; 
            }
            boardState[i] = "";
        }
    }
    // Random Move
    const availableCells = boardState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (availableCells.length > 0) {
        const randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
        return randomMove;
    }

    return -1; 
}
function isWinner(player) {
    for (const condition of winningConditions) {
        if (condition.every(index => boardState[index] === player)) {
            return true;
        }
    }
    return false;
}
function showStartScreen() {
    gameArea.classList.add('hidden');
    startScreen.classList.remove('hidden');
}
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
startButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', showStartScreen);