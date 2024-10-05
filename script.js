// Adding sound effects
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');
const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true; // Loop the background music

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Size of each snake segment and food
let snake = [{ x: 160, y: 160 }]; // Initial snake position (center)
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};
let direction = "RIGHT";
let score = 0;

// Get high score from localStorage (if it exists)
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
document.getElementById('highScore').innerText = `High Score: ${highScore}`;

// Start background music
backgroundMusic.play();

// Event listener for arrow keys
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (key === 38 && direction !== "DOWN") {
    direction = "UP";
  } else if (key === 39 && direction !== "LEFT") {
    direction = "RIGHT";
  } else if (key === 40 && direction !== "UP") {
    direction = "DOWN";
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Move snake in the current direction
  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;

  // Check if snake eats the food
  if (snakeX === food.x && snakeY === food.y) {
    // Play eat sound
    eatSound.play();

    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
    // Generate new food
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    // Remove the tail
    snake.pop();
  }

  // Add new head
  let newHead = { x: snakeX, y: snakeY };

  // Check for collisions with walls or self
  if (
    snakeX < 0 ||
    snakeX >= canvas.width ||
    snakeY < 0 ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    // Play game over sound
    gameOverSound.play();
    
    // Stop background music
    backgroundMusic.pause();
    
    // Log "Game Over" in the console
    console.log("Game Over");

    // Display the "Game Over" message
    document.getElementById("gameOverMessage").style.display = "block";

    clearInterval(game);
    // Check and update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      document.getElementById('highScore').innerText = `High Score: ${highScore}`;
    }
  }

  snake.unshift(newHead);
}

// Collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Start the game loop
let game = setInterval(drawGame, 100);