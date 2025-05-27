let selectedMode = 'pvp';

function selectMode(mode) {
    selectedMode = mode;
    // Update button styles
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.style.opacity = '0.7';
    });
    document.querySelector(`.${mode}-btn`).style.opacity = '1';
}

function startGame() {
    // Store the selected game mode in localStorage
    localStorage.setItem('gameMode', selectedMode);
    // Redirect to the game page
    window.location.href = 'game.html';
}

// Responsive Design Functions
function updateResponsiveStyles() {
    const container = document.querySelector('.start-container');
    const windowWidth = window.innerWidth;
    
    // Calculate responsive sizes
    const containerWidth = Math.min(windowWidth * 0.9, 400);
    const buttonWidth = Math.min(containerWidth * 0.8, 300);
    
    // Update container
    container.style.width = `${containerWidth}px`;
    container.style.padding = `${Math.min(containerWidth * 0.05, 2)}rem`;
    
    // Update game icon
    const gameIcon = document.querySelector('.game-icon');
    gameIcon.style.fontSize = `${Math.min(containerWidth * 0.15, 4)}rem`;
    
    // Update title
    const h1 = document.querySelector('h1');
    h1.style.fontSize = `${Math.min(containerWidth * 0.08, 2.5)}rem`;
    
    // Update buttons
    const buttons = document.querySelectorAll('.mode-btn, .start-btn');
    buttons.forEach(button => {
        button.style.width = `${buttonWidth}px`;
        button.style.padding = `${Math.min(containerWidth * 0.03, 1)}rem`;
        button.style.fontSize = `${Math.min(containerWidth * 0.04, 1.2)}rem`;
        
        // Update icons
        const icon = button.querySelector('i');
        if (icon) {
            icon.style.fontSize = `${Math.min(containerWidth * 0.05, 1.5)}rem`;
        }
    });
    
    // Update game info
    const gameInfo = document.querySelector('.game-info');
    gameInfo.style.padding = `${Math.min(containerWidth * 0.04, 1.5)}rem`;
    gameInfo.style.fontSize = `${Math.min(containerWidth * 0.03, 1)}rem`;
    
    // Update tips
    const tips = document.querySelectorAll('.game-info p');
    tips.forEach(tip => {
        tip.style.marginBottom = `${Math.min(containerWidth * 0.02, 0.8)}rem`;
    });
}

// Initialize responsive design
window.addEventListener('load', function() {
    updateResponsiveStyles();
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

// Update button interaction based on device
if (isTouchDevice()) {
    document.querySelectorAll('button').forEach(button => {
        button.style.cursor = 'pointer';
        button.style.touchAction = 'manipulation';
    });
}

// Prevent double-tap zoom on mobile
document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

// Handle touch events for better mobile experience
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