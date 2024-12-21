const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorInput = document.getElementById('color');
const sizeInput = document.getElementById('size');
const eraserButton = document.getElementById('eraser');
const clearButton = document.getElementById('clear');
const saveButton = document.getElementById('save');
const loadInput = document.getElementById('load');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let currentSize = 5;
let isErasing = false;

// Array to store drawing history
let history = [];
let currentStep = -1; // Index of the current step in the history

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// For touch devices
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

colorInput.addEventListener('change', () => {
  currentColor = colorInput.value;
});

sizeInput.addEventListener('input', () => {
  currentSize = sizeInput.value;
});

eraserButton.addEventListener('click', () => {
  isErasing = !isErasing;
  eraserButton.textContent = isErasing ? 'Draw' : 'Eraser';
});

clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  history.push(canvas.toDataURL()); // Save the cleared state to history
  currentStep++;
});

saveButton.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = dataURL;
  link.click();
});

loadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      history.push(canvas.toDataURL()); // Save the loaded state to history
      currentStep++;
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(file);
});

undoButton.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    const img = new Image();
    img.src = history[currentStep];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }
});

redoButton.addEventListener('click', () => {
  if (currentStep < history.length - 1) {
    currentStep++;
    const img = new Image();
    img.src = history[currentStep];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }
});

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = getCoordinates(e);

  // Save the current canvas state to history
  history.push(canvas.toDataURL());
  currentStep++;

  // Limit the history size (optional)
  if (history.length > 20) {
    history.shift(); // Remove the oldest state
    currentStep--;
  }
}

function draw(e) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  [lastX, lastY] = getCoordinates(e);
  ctx.lineTo(lastX, lastY);
  ctx.strokeStyle = isErasing ? '#ffffff' : currentColor; // White color for erasing
  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function getCoordinates(e) {
  if (e.type.startsWith('touch')) {
    return [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
  } else {
    return [e.offsetX, e.offsetY];
  }
}