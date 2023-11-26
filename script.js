const canvas = document.getElementById('cvs');
const context = canvas.getContext('2d');

const FRAME_RATE = 8;
const BLOCK_SIZE = 16;

let gameIntervalID = undefined;

const environment = {
    width: BLOCK_SIZE * 16,
    height: BLOCK_SIZE * 16,
};

const colors = {
    snake: '#001524',
    apple: '#C21010',
    line: '#181818',
    grass1: '#A6CF98',
    grass2: '#557C55',
};

const DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    RIGHT: 'right',
    LEFT: 'left',
};

let snakeDirection = DIRECTIONS.RIGHT;

let snake = [
    { x: BLOCK_SIZE * 5, y: BLOCK_SIZE * 6 },
    { x: BLOCK_SIZE * 4, y: BLOCK_SIZE * 6 },
    { x: BLOCK_SIZE * 3, y: BLOCK_SIZE * 6 },
    { x: BLOCK_SIZE * 2, y: BLOCK_SIZE * 6 },
    { x: BLOCK_SIZE, y: BLOCK_SIZE * 6 },
];

function initialize() {
    canvas.width = environment.width;
    canvas.height = environment.height;

    gameIntervalID = setInterval(drawGame, 1000 / FRAME_RATE);
}

function drawBackground() {
    for (let i = 0; i < environment.width / BLOCK_SIZE; i++) {
        for (let j = 0; j < environment.height / BLOCK_SIZE; j++) {
            const isEvenRow = i % 2 === 0;
            const isEvenColumn = j % 2 === 0;

            const isGrass1 = (isEvenRow && isEvenColumn) || (!isEvenRow && !isEvenColumn);
            const color = isGrass1 ? colors.grass1 : colors.grass2;

            context.fillStyle = color;
            context.fillRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

function drawGridLines() {
    for (let i = 0; i < environment.width; i += BLOCK_SIZE) {
        context.strokeStyle = colors.line;
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, environment.height);
        context.stroke();
    }

    for (let i = 0; i < environment.height; i += BLOCK_SIZE) {
        context.strokeStyle = colors.line;
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(environment.width, i);
        context.stroke();
    }
}

function checkSelfCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            console.log('Snake bit itself');
            return true;
        }
    }
    return false;
}

function handleWallCollision() {
    if (snake[0].y === environment.height + BLOCK_SIZE) snake[0].y = 0;

    if (snake[0].x === environment.width + BLOCK_SIZE) snake[0].x = 0;

    if (snake[0].y === 0 - BLOCK_SIZE) snake[0].y = environment.height;
    
    if (snake[0].x === 0 - BLOCK_SIZE) snake[0].x = environment.width;
}

function generateRandomAppleLocation() {
    const x = Math.floor(Math.random() * (environment.width / BLOCK_SIZE)) * BLOCK_SIZE;
    const y = Math.floor(Math.random() * (environment.height / BLOCK_SIZE)) * BLOCK_SIZE;
    return { x, y };
}

let appleLocation = generateRandomAppleLocation();


function checkIfAteApple() {
    if (snake[0].x === appleLocation.x && snake[0].y === appleLocation.y) {
        const newHead = { x: snake[0].x, y: snake[0].y };
        snake.unshift(newHead);
        return true;
    }
    return false;
}

function drawGame() {
    context.clearRect(0, 0, environment.width, environment.height);
    drawBackground();
    drawGridLines();

    context.fillStyle = colors.apple;
    context.fillRect(appleLocation.x, appleLocation.y, BLOCK_SIZE, BLOCK_SIZE);

    const newHead = { x: snake[0].x, y: snake[0].y };

    switch (snakeDirection) {
        case DIRECTIONS.RIGHT:
            newHead.x += BLOCK_SIZE;
            break;
        case DIRECTIONS.LEFT:
            newHead.x -= BLOCK_SIZE;
            break;
        case DIRECTIONS.UP:
            newHead.y -= BLOCK_SIZE;
            break;
        case DIRECTIONS.DOWN:
            newHead.y += BLOCK_SIZE;
            break;
    }

    snake.unshift(newHead);

    handleWallCollision();

    if (checkSelfCollision()) clearInterval(gameIntervalID);

    if (checkIfAteApple()) appleLocation = generateRandomAppleLocation();

    if (snake.length !== BLOCK_SIZE * BLOCK_SIZE) snake.pop();

    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = colors.snake;
        context.fillRect(snake[i].x, snake[i].y, BLOCK_SIZE, BLOCK_SIZE);
    }
}

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (snakeDirection !== DIRECTIONS.DOWN) snakeDirection = DIRECTIONS.UP;
            break;
        case 'ArrowDown':
            if (snakeDirection !== DIRECTIONS.UP) snakeDirection = DIRECTIONS.DOWN;
            break;
        case 'ArrowRight':
            if (snakeDirection !== DIRECTIONS.LEFT) snakeDirection = DIRECTIONS.RIGHT;
            break;
        case 'ArrowLeft':
            if (snakeDirection !== DIRECTIONS.RIGHT) snakeDirection = DIRECTIONS.LEFT;
            break;
    }
});

initialize();
