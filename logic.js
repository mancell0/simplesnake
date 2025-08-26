
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const retryBtn = document.getElementById('retryBtn');

// GAME CONSTANS
const gridSize = 20;
let snakeSpeed = 100; // milliseconds
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoopInterval;

// SNAKE PROPERTIES
let snake = [];
let food = {};
let dx = gridSize; 
let dy = 0;      
let changingDirection = false;
let snakeColor; 

highScoreDisplay.textContent = highScore;

retryBtn.addEventListener('click', startGame);

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    snakeSpeed = 100;
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 },
    ];
    dx = gridSize;
    dy = 0;
    changingDirection = false;
    placeFood();
    
    setRandomSnakeColor();

    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
    }
    gameLoopInterval = setInterval(gameLoop, snakeSpeed);
}

function gameLoop() {
    if (gameOver()) {
        clearInterval(gameLoopInterval);
        return;
    }
    
    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

function drawSnakePart(part) {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
    ctx.strokeRect(part.x, part.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

function clearCanvas() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score++;
        scoreDisplay.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
    };

    snake.forEach(function(part) {
        const foodIsOnSnake = part.x === food.x && part.y === food.y;
        if (foodIsOnSnake) {
            placeFood();
        }
    });
}

function gameOver() {
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;
    
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}

function setRandomSnakeColor() {
    const colors = ['#10e7e7ff', '#ff00ffff', '#ebeb0ddc', '#ff4400ff', '#32CD32', '#3b3b3b36', '#ffffffff', '#dfbf0dff'];
    snakeColor = colors[Math.floor(Math.random() * colors.length)];
}

startGame();
