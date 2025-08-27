const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverText = document.getElementById('gameOverText');
const retryBtn = document.getElementById('retryBtn');

const gridSize = 20;
const cellSize = canvas.width / gridSize;

let snake;
let food;
let dx;
let dy;
let isGameOver = false;
let gameLoopInterval;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let changingDirection = false;

const customizationColors = ['#00FF00', '#FF0000', '#0000FF', '#FFFF00', '#FF00FF'];
const snakeEyes = ['⚪', '⚫', '👁️', '👀', '🟢'];

let snakeBodyColor = customizationColors[0];
let snakeHeadEye = snakeEyes[0];

const customizeContainer = document.getElementById('customizeContainer');
const bodyColorPicker = document.getElementById('bodyColorPicker');
const headEyePicker = document.getElementById('headEyePicker');

highScoreDisplay.textContent = highScore;
retryBtn.addEventListener('click', startGame);

// Add keydown listener to restart game on Enter key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !gameOverScreen.classList.contains('hidden')) {
        startGame();
    }
});

//GAME LOGIC
function startGame() {
    gameOverScreen.classList.add('hidden');
    
    // INITIALIZE
    snake = [{ x: 10 * cellSize, y: 10 * cellSize }];
    dx = cellSize;
    dy = 0;
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
    changingDirection = false;

    //FIRST FOOD
    placeFood();

    //GAME LOOP
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    if (gameOver()) {
        clearInterval(gameLoopInterval);
        gameOverText.textContent = `Game Over! Your Score: ${score}`;
        gameOverScreen.classList.remove('hidden');
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

// DRAW GAME
function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    drawSnake();

    // Draw the food
    drawFood();
}

function drawSnake() {
    // Draw the snake's body
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = snakeBodyColor;
        ctx.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, cellSize, cellSize);
    }

    // Draw the snake's head with the chosen eye
    const head = snake[0];
    ctx.fillStyle = 'black'; // Outline for the head
    ctx.fillRect(head.x, head.y, cellSize, cellSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(head.x, head.y, cellSize, cellSize);
    
    // EMOJI
    ctx.font = `${cellSize *P 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let eyeOffsetX = cellSize / 2;
    let eyeOffsetY = cellSize / 2;
    
    // EYE MOVEMENT
    const goingUp = dy === -cellSize;
    const goingDown = dy === cellSize;
    const goingLeft = dx === -cellSize;
    const goingRight = dx === cellSize;

    if (goingUp) eyeOffsetY = cellSize * 0.3;
    if (goingDown) eyeOffsetY = cellSize * 0.7;
    if (goingLeft) eyeOffsetX = cellSize * 0.3;
    if (goingRight) eyeOffsetX = cellSize * 0.7;
    
    ctx.fillText(snakeHeadEye, head.x + eyeOffsetX, head.y + eyeOffsetY);
}


function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, cellSize, cellSize);
    ctx.strokeStyle = 'darkred';
    ctx.strokeRect(food.x, food.y, cellSize, cellSize);
}

function clearCanvas() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// --- Game Logic Functions ---
function moveSnake() {
    // Create a new head based on current direction
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        // Update score
        score++;
        scoreDisplay.textContent = score;
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // Generate new food
        placeFood();
    } else {
        // Remove the last segment if the snake hasn't eaten food
        snake.pop();
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
        y: Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize
    };
    
    // Ensure food doesn't spawn on the snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
            y: Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize
        };
    }
}

function gameOver() {
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;
    
    // Check for self-collision
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}


// --- Event Listeners ---
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -cellSize;
    const goingDown = dy === cellSize;
    const goingRight = dx === cellSize;
    const goingLeft = dx === -cellSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -cellSize;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -cellSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = cellSize;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = cellSize;
    }
}

// --- Customization Logic ---
function setupCustomization() {
    // Populate the body color picker
    customizationColors.forEach(color => {
        const option = document.createElement('div');
        option.classList.add('color-option');
        option.style.backgroundColor = color;
        option.addEventListener('click', () => {
            snakeBodyColor = color;
            // Highlight the selected option
            document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
            option.classList.add('selected');
        });
        bodyColorPicker.appendChild(option);
    });
    
    // Populate the head eye picker
    snakeEyes.forEach(eye => {
        const option = document.createElement('div');
        option.classList.add('eye-option');
        option.textContent = eye;
        option.addEventListener('click', () => {
            snakeHeadEye = eye;
            // Highlight the selected option
            document.querySelectorAll('.eye-option').forEach(el => el.classList.remove('selected'));
            option.classList.add('selected');
        });
        headEyePicker.appendChild(option);
    });
    
    // Set initial selections
    document.querySelector('.color-option').classList.add('selected');
    document.querySelector('.eye-option').classList.add('selected');
}

// --- Main execution start point ---
window.onload = function() {
    startGame();
    setupCustomization();
};
