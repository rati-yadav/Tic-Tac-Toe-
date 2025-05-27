// DOM Elements
const totalGames = document.getElementById('totalGames');
const wins = document.getElementById('wins');
const draws = document.getElementById('draws');
const historyList = document.getElementById('historyList');
const backBtn = document.getElementById('backBtn');

// Responsive Design Functions
function updateResponsiveStyles() {
    const container = document.querySelector('.stats-container');
    const windowWidth = window.innerWidth;
    
    // Calculate responsive sizes
    const containerWidth = Math.min(windowWidth * 0.9, 400);
    
    // Update container
    container.style.width = `${containerWidth}px`;
    container.style.padding = `${Math.min(containerWidth * 0.05, 2)}rem`;
    
    // Update font sizes
    const h1 = document.querySelector('h1');
    const stats = document.querySelectorAll('.stat');
    const historyItems = document.querySelectorAll('.history-item');
    
    h1.style.fontSize = `${Math.min(containerWidth * 0.045, 1.8)}rem`;
    stats.forEach(stat => {
        stat.style.fontSize = `${Math.min(containerWidth * 0.03, 1.2)}rem`;
    });
    historyItems.forEach(item => {
        item.style.fontSize = `${Math.min(containerWidth * 0.025, 1)}rem`;
    });
    
    // Update buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.padding = `${Math.min(containerWidth * 0.02, 0.8)}rem ${Math.min(containerWidth * 0.04, 1.5)}rem`;
        button.style.fontSize = `${Math.min(containerWidth * 0.025, 1)}rem`;
    });
}

// Initialize responsive design
window.addEventListener('load', function() {
    updateResponsiveStyles();
    loadStats();
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

// Handle button touch events
if (isTouchDevice()) {
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
}

// Load and display statistics
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('gameStats')) || {
        totalGames: 0,
        wins: 0,
        draws: 0,
        history: []
    };

    // Update stats display
    totalGames.textContent = stats.totalGames;
    wins.textContent = stats.wins;
    draws.textContent = stats.draws;

    // Update history list
    historyList.innerHTML = '';
    stats.history.reverse().forEach(game => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const date = new Date(game.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const mode = game.mode === 'pvp' ? 'Player vs Player' : 'Player vs Computer';
        const result = game.result === 'win' ? `Winner: ${game.winner === 'X' ? '❌' : '⭕'}` : 'Draw';
        
        li.textContent = `${dateStr} - ${mode} - ${result}`;
        historyList.appendChild(li);
    });
}

function goBack() {
    window.location.href = 'game.html';
} 