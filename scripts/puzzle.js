const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
const logoImg = new Image();
const GRID = 2; 

let tileSize, board = [], empty = {};
let redirectSeconds = 3, countdownInterval;


img.src = '../assets/sol3.jpg';
logoImg.src = '../assets/solar2.png';
const moveSound = new Audio('../assets/move.mp3'); 

let imagesLoaded = 0;
[img, logoImg].forEach(image => {
  image.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      startGame();
    }
  };
});

function startGame() {
  setupCanvasSize();
  initBoard();
  shuffleBoard();
  drawBoard();
  hideCountdown();
}

function setupCanvasSize() {
  const size = Math.min(window.innerWidth * 1.0, window.innerHeight * 1.0);
  tileSize = Math.floor(size / GRID);
  canvas.width = tileSize * GRID;
  canvas.height = tileSize * GRID;
  ctx.imageSmoothingEnabled = false;
}

function initBoard() {
  board = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      board.push({ correctX: x, correctY: y, x, y });
    }
  }
  empty = board.pop(); 
}

function shuffleBoard() {
  for (let i = 0; i < 100; i++) {
    const neighbors = board.filter(p =>
      Math.abs(p.x - empty.x) + Math.abs(p.y - empty.y) === 1
    );
    const n = neighbors[Math.floor(Math.random() * neighbors.length)];
    swap(n, empty);
  }
  board.push(empty);
}

function swap(a, b) {
  [a.x, b.x] = [b.x, a.x];
  [a.y, b.y] = [b.y, a.y];
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach(p => {
    const sx = p.correctX * tileSize;
    const sy = p.correctY * tileSize;
    const dx = p.x * tileSize;
    const dy = p.y * tileSize;

    if (p === empty) {
      ctx.drawImage(logoImg, dx, dy, tileSize, tileSize);
    } else {
      ctx.drawImage(img, sx, sy, tileSize, tileSize, dx, dy, tileSize, tileSize);
    }
  });
}

canvas.addEventListener('click', e => {
  const mx = Math.floor(e.offsetX / tileSize);
  const my = Math.floor(e.offsetY / tileSize);
  const clicked = board.find(p => p.x === mx && p.y === my);

  if (clicked && isNeighbor(clicked, empty)) {
    swap(clicked, empty);
    moveSound.currentTime = 0; 
    moveSound.play(); 
    drawBoard();

    const isComplete = board.every(p => p.x === p.correctX && p.y === p.correctY);
    if (isComplete) {
      setTimeout(() => {
        alert("¡Felicidades! Has completado el rompecabezas 🎉");
        startRedirectCountdown();
      }, 100);
    }
  }
});

function isNeighbor(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

function startRedirectCountdown() {
  const countdown = document.getElementById('countdown');
  countdown.style.display = 'block';
  countdown.classList.add('opacity-100');
  let secs = redirectSeconds;
  document.getElementById('secs').textContent = secs;

  countdownInterval = setInterval(() => {
    secs--;
    document.getElementById('secs').textContent = secs;
    if (secs <= 0) {
      clearInterval(countdownInterval);
      window.location.href = '../html/home.html';
    }
  }, 1000);
}

function hideCountdown() {
  const countdown = document.getElementById('countdown');
  countdown.style.display = 'none';
  countdown.classList.remove('opacity-100');
}


window.addEventListener('resize', () => {
  if (!img.complete || !logoImg.complete) return;
  setupCanvasSize();
  drawBoard();
});


document.querySelector("button").addEventListener("click", () => {
  clearInterval(countdownInterval);
  startGame();
});
