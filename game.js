// Game state
let gameActive = true;
let currentPlayer = 'X';
let board = Array(9).fill('');
let scores = { X: 0, O: 0 };
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// DOM Elements
const gameModeSelect = document.getElementById('gameMode');
const gameMessage = document.getElementById('gameMessage');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');

// Responsive Design Functions
function updateResponsiveStyles() {
    const container = document.querySelector('.game-container');
    const gameBoard = document.querySelector('.game-board');
    const cells = document.querySelectorAll('.cell');
    const windowWidth = window.innerWidth;
    
    // Calculate responsive sizes
    const containerWidth = Math.min(windowWidth * 0.9, 400);
    const boardWidth = Math.min(containerWidth * 0.8, 300);
    const cellSize = boardWidth / 3 - 10; // Account for gap
    
    // Update container
    container.style.width = `${containerWidth}px`;
    container.style.padding = `${Math.min(containerWidth * 0.05, 2)}rem`;
    
    // Update game board
    gameBoard.style.width = `${boardWidth}px`;
    gameBoard.style.gap = `${Math.min(boardWidth * 0.03, 10)}px`;
    
    // Update cells
    cells.forEach(cell => {
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${Math.min(cellSize * 0.4, 2.5)}rem`;
    });
    
    // Update X and O symbols
    const xSymbols = document.querySelectorAll('.cell.x::before');
    const oSymbols = document.querySelectorAll('.cell.o::before');
    
    xSymbols.forEach(symbol => {
        symbol.style.fontSize = `${Math.min(cellSize * 0.5, 3.5)}rem`;
    });
    
    oSymbols.forEach(symbol => {
        symbol.style.fontSize = `${Math.min(cellSize * 0.45, 3)}rem`;
    });
    
    // Update header and controls
    const header = document.querySelector('.header');
    const gameOptions = document.querySelector('.game-options');
    const gameStatus = document.querySelector('.game-status');
    
    header.style.marginBottom = `${Math.min(containerWidth * 0.04, 1.5)}rem`;
    gameOptions.style.marginBottom = `${Math.min(containerWidth * 0.04, 1.5)}rem`;
    gameStatus.style.marginBottom = `${Math.min(containerWidth * 0.04, 1.5)}rem`;
    
    // Update font sizes
    const h1 = document.querySelector('h1');
    const scoreBoard = document.querySelector('.score-board');
    
    h1.style.fontSize = `${Math.min(containerWidth * 0.045, 1.8)}rem`;
    gameMessage.style.fontSize = `${Math.min(containerWidth * 0.03, 1.2)}rem`;
    scoreBoard.style.fontSize = `${Math.min(containerWidth * 0.027, 1.1)}rem`;
    
    // Update buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.padding = `${Math.min(containerWidth * 0.02, 0.8)}rem ${Math.min(containerWidth * 0.04, 1.5)}rem`;
        button.style.fontSize = `${Math.min(containerWidth * 0.025, 1)}rem`;
    });
    
    // Update select element
    const gameMode = document.getElementById('gameMode');
    gameMode.style.padding = `${Math.min(containerWidth * 0.02, 0.8)}rem`;
    gameMode.style.fontSize = `${Math.min(containerWidth * 0.025, 1)}rem`;
}

// Initialize responsive design
window.addEventListener('load', function() {
    updateResponsiveStyles();
    const savedMode = localStorage.getItem('gameMode');
    if (savedMode) {
        gameModeSelect.value = savedMode;
    }
    initializeGame();
});

// Update on window resize
window.addEventListener('resize', function() {
    updateResponsiveStyles();
});

// Update on orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(updateResponsiveStyles, 100);
});

// Touch device detection
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Update cell interaction based on device
if (isTouchDevice()) {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.style.touchAction = 'manipulation';
    });
}

// Prevent double-tap zoom on mobile
document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

// Handle touch events for better mobile experience
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
    }, { passive: false });

    cell.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1)';
    }, { passive: false });
});

// Handle button touch events
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
    }, { passive: false });

    button.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(1)';
    }, { passive: false });
});

// Initialize game
function initializeGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });
    gameModeSelect.addEventListener('change', (e) => {
        resetGame();
    });
    updateScoreDisplay();
}

function handleCellClick(cell) {
    const index = cell.getAttribute('data-index');
    if (board[index] === '' && gameActive) {
        makeMove(index);
        if (gameModeSelect.value === 'pvc' && gameActive && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
}

function makeMove(index) {
    board[index] = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());
    
    if (checkWin()) {
        handleWin();
    } else if (checkDraw()) {
        handleDraw();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateGameMessage();
    }
}

function computerMove() {
    let index = findBestMove();
    makeMove(index);
}

function findBestMove() {
    // Try to win
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWin()) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Try to block
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWin()) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Random move
    let emptyCells = board
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function handleWin() {
    gameActive = false;
    scores[currentPlayer]++;
    updateScoreDisplay();
    
    const winningCombo = winningCombinations.find(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });

    winningCombo.forEach(index => {
        cells[index].classList.add('winner');
    });

    gameMessage.textContent = `Player ${currentPlayer} wins! 🎉`;

    // Save game statistics
    saveGameResult('win', currentPlayer);
}

function handleDraw() {
    gameActive = false;
    gameMessage.textContent = "It's a draw! 🤝";

    // Save game statistics
    saveGameResult('draw');
}

function saveGameResult(result, winner = null) {
    // Load existing stats
    let stats = JSON.parse(localStorage.getItem('gameStats')) || {
        totalGames: 0,
        wins: 0,
        draws: 0,
        history: []
    };

    // Update stats
    stats.totalGames++;
    if (result === 'win') {
        stats.wins++;
    } else if (result === 'draw') {
        stats.draws++;
    }

    // Add to history
    stats.history.push({
        date: new Date().toISOString(),
        mode: gameModeSelect.value,
        result: result,
        winner: winner
    });

    // Keep only last 50 games in history
    if (stats.history.length > 50) {
        stats.history = stats.history.slice(-50);
    }

    // Save updated stats
    localStorage.setItem('gameStats', JSON.stringify(stats));
}

function updateGameMessage() {
    gameMessage.textContent = `Player ${currentPlayer}'s Turn`;
}

function updateScoreDisplay() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function resetGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.className = 'cell';
    });
    
    updateGameMessage();
}

function goBack() {
    window.location.href = 'index.html';
}

function showStats() {
    window.location.href = 'stats.html';
} 