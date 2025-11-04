// Game Configuration
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

// Game State
let score = 0;
let lives = 3;
let gameRunning = false;
let pacman = { x: 1, y: 1, direction: 'right' };
let ghosts = [];
let powerMode = false;
let powerModeTimer = null;

// Game Board Layout (1 = wall, 0 = path, 2 = dot, 3 = power pellet)
const layout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,3,1],
    [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,1,1,0,1,1,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,1,0,0,1,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,0,0,0,0,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
    [1,3,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,3,1],
    [1,1,2,1,2,1,2,1,1,1,1,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Store initial layout for dots
let dotsLayout = JSON.parse(JSON.stringify(layout));

// DOM Elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startButton = document.getElementById('start-button');
const gameOverDiv = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Initialize Game
function initGame() {
    createBoard();
    initPacman();
    initGhosts();
    updateDisplay();
}

// Create Game Board
function createBoard() {
    gameBoard.innerHTML = '';
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${x}-${y}`;

            if (layout[y][x] === 1) {
                cell.classList.add('wall');
            } else if (dotsLayout[y][x] === 2) {
                cell.classList.add('path', 'dot');
            } else if (dotsLayout[y][x] === 3) {
                cell.classList.add('path', 'power-pellet');
            } else {
                cell.classList.add('path');
            }

            gameBoard.appendChild(cell);
        }
    }
}

// Initialize Pacman
function initPacman() {
    pacman = { x: 1, y: 1, direction: 'right' };
    drawPacman();
}

// Initialize Ghosts
function initGhosts() {
    ghosts = [
        { x: 9, y: 9, direction: 'up', name: 'blinky', baseX: 9, baseY: 9 },
        { x: 10, y: 9, direction: 'up', name: 'pinky', baseX: 10, baseY: 9 },
        { x: 9, y: 10, direction: 'down', name: 'inky', baseX: 9, baseY: 10 },
        { x: 10, y: 10, direction: 'down', name: 'clyde', baseX: 10, baseY: 10 }
    ];
    drawGhosts();
}

// Draw Pacman
function drawPacman() {
    const cells = document.querySelectorAll('.pacman');
    cells.forEach(cell => {
        cell.classList.remove('pacman', 'right', 'left', 'up', 'down');
    });

    const cell = document.getElementById(`cell-${pacman.x}-${pacman.y}`);
    if (cell) {
        cell.classList.add('pacman', pacman.direction);
    }
}

// Draw Ghosts
function drawGhosts() {
    const cells = document.querySelectorAll('.ghost');
    cells.forEach(cell => {
        cell.classList.remove('ghost', 'blinky', 'pinky', 'inky', 'clyde', 'scared');
    });

    ghosts.forEach(ghost => {
        const cell = document.getElementById(`cell-${ghost.x}-${ghost.y}`);
        if (cell) {
            cell.classList.add('ghost', ghost.name);
            if (powerMode) {
                cell.classList.add('scared');
            }
        }
    });
}

// Move Pacman
function movePacman(newX, newY) {
    if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) {
        // Wrap around
        if (newX < 0) newX = GRID_WIDTH - 1;
        if (newX >= GRID_WIDTH) newX = 0;
        if (newY < 0) newY = GRID_HEIGHT - 1;
        if (newY >= GRID_HEIGHT) newY = 0;
    }

    if (layout[newY][newX] !== 1) {
        pacman.x = newX;
        pacman.y = newY;

        // Check for dots
        if (dotsLayout[newY][newX] === 2) {
            score += 10;
            dotsLayout[newY][newX] = 0;
            const cell = document.getElementById(`cell-${newX}-${newY}`);
            cell.classList.remove('dot');
            checkWin();
        }

        // Check for power pellets
        if (dotsLayout[newY][newX] === 3) {
            score += 50;
            dotsLayout[newY][newX] = 0;
            const cell = document.getElementById(`cell-${newX}-${newY}`);
            cell.classList.remove('power-pellet');
            activatePowerMode();
            checkWin();
        }

        drawPacman();
        updateDisplay();
    }
}

// Activate Power Mode
function activatePowerMode() {
    powerMode = true;
    if (powerModeTimer) {
        clearTimeout(powerModeTimer);
    }
    powerModeTimer = setTimeout(() => {
        powerMode = false;
        drawGhosts();
    }, 7000);
    drawGhosts();
}

// Move Ghosts
function moveGhosts() {
    ghosts.forEach(ghost => {
        const directions = ['up', 'down', 'left', 'right'];
        const possibleMoves = [];

        directions.forEach(dir => {
            let newX = ghost.x;
            let newY = ghost.y;

            switch(dir) {
                case 'up': newY--; break;
                case 'down': newY++; break;
                case 'left': newX--; break;
                case 'right': newX++; break;
            }

            if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
                if (layout[newY][newX] !== 1) {
                    possibleMoves.push({ x: newX, y: newY, direction: dir });
                }
            }
        });

        if (possibleMoves.length > 0) {
            let chosenMove;
            if (powerMode) {
                // Run away from pacman
                chosenMove = possibleMoves.reduce((best, move) => {
                    const dist = Math.abs(move.x - pacman.x) + Math.abs(move.y - pacman.y);
                    const bestDist = Math.abs(best.x - pacman.x) + Math.abs(best.y - pacman.y);
                    return dist > bestDist ? move : best;
                });
            } else {
                // Chase pacman (simple AI)
                chosenMove = possibleMoves.reduce((best, move) => {
                    const dist = Math.abs(move.x - pacman.x) + Math.abs(move.y - pacman.y);
                    const bestDist = Math.abs(best.x - pacman.x) + Math.abs(best.y - pacman.y);
                    return dist < bestDist ? move : best;
                });
            }

            ghost.x = chosenMove.x;
            ghost.y = chosenMove.y;
            ghost.direction = chosenMove.direction;
        }
    });

    drawGhosts();
    checkCollision();
}

// Check Collision with Ghosts
function checkCollision() {
    ghosts.forEach((ghost, index) => {
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            if (powerMode) {
                // Eat ghost
                score += 200;
                ghost.x = ghost.baseX;
                ghost.y = ghost.baseY;
                updateDisplay();
            } else {
                // Lose life
                lives--;
                updateDisplay();

                if (lives <= 0) {
                    endGame();
                } else {
                    // Reset positions
                    initPacman();
                    initGhosts();
                }
            }
        }
    });
}

// Check Win Condition
function checkWin() {
    let dotsRemaining = 0;
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (dotsLayout[y][x] === 2 || dotsLayout[y][x] === 3) {
                dotsRemaining++;
            }
        }
    }

    if (dotsRemaining === 0) {
        alert('Você venceu! Parabéns!');
        endGame();
    }
}

// Update Display
function updateDisplay() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

// End Game
function endGame() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverDiv.classList.remove('hidden');
    startButton.textContent = 'Iniciar Jogo';
}

// Reset Game
function resetGame() {
    score = 0;
    lives = 3;
    powerMode = false;
    dotsLayout = JSON.parse(JSON.stringify(layout));
    gameOverDiv.classList.add('hidden');
    initGame();
}

// Start Game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        startButton.textContent = 'Jogo em Andamento';
        resetGame();
        gameLoop();
    }
}

// Game Loop
let gameInterval;
function gameLoop() {
    if (gameRunning) {
        gameInterval = setInterval(() => {
            if (gameRunning) {
                moveGhosts();
            }
        }, 300);
    } else {
        clearInterval(gameInterval);
    }
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    let newX = pacman.x;
    let newY = pacman.y;

    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            newY--;
            pacman.direction = 'up';
            break;
        case 'ArrowDown':
            e.preventDefault();
            newY++;
            pacman.direction = 'down';
            break;
        case 'ArrowLeft':
            e.preventDefault();
            newX--;
            pacman.direction = 'left';
            break;
        case 'ArrowRight':
            e.preventDefault();
            newX++;
            pacman.direction = 'right';
            break;
        default:
            return;
    }

    movePacman(newX, newY);
});

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => {
    gameOverDiv.classList.add('hidden');
    startGame();
});

// Initialize on load
initGame();
