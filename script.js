const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// For touch devices
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = getCoordinates(e);
}

function draw(e) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  [lastX, lastY] = getCoordinates(e);
  ctx.lineTo(lastX, lastY);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function getCoordinates(e) {
  if (e.type.startsWith('touch')) {
    return [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
  } else {
    return [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
  }
}