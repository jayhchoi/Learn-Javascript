// Variables
let numOfColors = 6;
let colors = generateRandomColors(numOfColors);
let pickedColor = pickColor();

// Dom elements
const squares = Array.from(document.querySelectorAll(".square"));
const colorDisplay = document.querySelector("#color-display");
const message = document.querySelector("#message");
const h1 = document.querySelector("h1");
const resetBtn = document.querySelector("#reset-btn");
const easyBtn = document.querySelector("#easy-btn");
const hardBtn = document.querySelector("#hard-btn");

//////////// Add events ///////////
document.addEventListener("DOMContentLoaded", function() {
  changeColorDisplay(pickedColor);
  setColors(colors);
});
squares.forEach(square => {
  square.addEventListener("click", checkColor);
});
resetBtn.addEventListener("click", resetGame);
easyBtn.addEventListener("click", easyMode);
hardBtn.addEventListener("click", hardMode);

//////////// Event handlers /////////////
// Check the answer
function checkColor() {
  // this == e.target
  const clickedColor = this.style.backgroundColor;
  if (clickedColor === pickedColor) {
    message.textContent = "Correct!";
    resetBtn.textContent = "Play Again?";
    changeAllColors(pickedColor);
    // changeH1Bg(pickedColor);
  } else {
    this.style.backgroundColor = "#232323";
    message.textContent = "Try Again!";
  }
}

// Reset the game
function resetGame() {
  // generatge new random colors
  colors = generateRandomColors(numOfColors);
  // pick new one color
  pickedColor = pickColor();
  // change displayColor
  changeColorDisplay(pickedColor);
  // changeH1Bg("");
  // change colors on DOM
  setColors(colors);
  // toggle resetBtn
  resetBtn.textContent = "New Colors";
  // change message
  message.textContent = "";
}

// Set the game to easy mode
function easyMode() {
  this.classList.add("selected");
  hardBtn.classList.remove("selected");
  numOfColors = 3;
  resetGame();
  // Hide three squares
  const squares = document.querySelectorAll(".square");
  for (let index = 3; index < squares.length; index++) {
    squares[index].style.display = "none";
  }
}

// Set the game to hard mode
function hardMode() {
  this.classList.add("selected");
  easyBtn.classList.remove("selected");
  numOfColors = 6;
  resetGame();
  // Show three hid squares
  const squares = document.querySelectorAll(".square");
  for (let index = 3; index < squares.length; index++) {
    squares[index].style.display = "block";
  }
}

//////////// Helper functions ////////////////
function changeAllColors(color) {
  squares.forEach(square => (square.style.backgroundColor = color));
}

function pickColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function generateRandomColors(size) {
  let arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(randomColor());
  }
  return arr;
}

function randomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  rgbColor = `rgb(${red}, ${green}, ${blue})`;
  return rgbColor;
}

function changeColorDisplay(pickedColor) {
  colorDisplay.textContent = pickedColor.toUpperCase();
}

function setColors(colors) {
  squares.forEach((square, index) => {
    square.style.backgroundColor = colors[index];
  });
}
