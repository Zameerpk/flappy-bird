const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');

// Game state
let birdImage = new Image();
birdImage.src = 'bird.png';  // Replace with your bird image

let bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    gravity: 0.8,
    lift: -10,
    velocity: 0
};

let pipes = [];
let frameCount = 0;
let score = 0;
let gameOver = false;
let gap = 150;
let gameStarted = false;

// Game dimensions
let originalCanvasWidth = 320;
let originalCanvasHeight = 480;
let scalingFactor = 1;

// Function to resize canvas dynamically
function resizeCanvas() {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Maintain aspect ratio of the game
    let aspectRatio = originalCanvasWidth / originalCanvasHeight;

    if (windowWidth / windowHeight < aspectRatio) {
        canvas.width = windowWidth;
        canvas.height = windowWidth / aspectRatio;
    } else {
        canvas.height = windowHeight;
        canvas.width = windowHeight * aspectRatio;
    }

    // Calculate the scaling factor
    scalingFactor = canvas.width / originalCanvasWidth;

    // Scale bird
    bird.width = 40 * scalingFactor;
    bird.height = 40 * scalingFactor;

    // Scale pipe gap based on the scaling factor
    gap = 150 * scalingFactor;
}

// Function to create pipes
function createPipe() {
    let topPipeHeight = Math.floor(Math.random() * (canvas.height - gap));
    pipes.push({
        x: canvas.width,
        topHeight: topPipeHeight,
        bottomY: topPipeHeight + gap,
        width: 30 * scalingFactor,
        speed: 2 * scalingFactor
    });
}

// Function to draw the bird
function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Function to draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);

        pipe.x -= pipe.speed;
    });
}

// Function to update the bird's position
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        gameOver = true;
    }
}

// Function to detect collision with pipes
function detectCollision(pipe) {
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
        if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY) {
            gameOver = true;
        }
    }
}

// Main game update loop
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (frameCount % 100 === 0) {
        createPipe();
    }

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    pipes.forEach(pipe => detectCollision(pipe));

    drawBird();
    drawPipes();
    updateBird();

    frameCount++;
    if (!gameOver) {
        score++;
        scoreElement.innerText = Math.floor(score / 100);
        requestAnimationFrame(updateGame);
    } else {
        alert("Game Over! Your score: " + Math.floor(score / 100));
        document.location.reload();
    }
}

// Function to make the bird flap
function flap() {
    bird.velocity = bird.lift;
}

// Resize canvas initially and on window resize
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Function to start the game when the button is clicked
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startButton.style.display = 'none'; // Hide the button
        document.addEventListener('keydown', flap);
        updateGame(); // Start the game loop
    }
}

// Add event listener to the Start button
startButton.addEventListener('click', startGame);