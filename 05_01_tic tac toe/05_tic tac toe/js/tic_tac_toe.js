"use strict";

/* ===============================
   New Game button
================================ */
const newGameBtnBox = document.getElementById("newgame-btn");
const newGameBtn = document.getElementById("btn90");

/* ===============================
   Game state
================================ */
let flag = "pen-flag";     // pen-flag | bear-flag
let counter = 9;           // số lượt còn lại
let isGameOver = false;
let winningLine = null;

/* ===============================
   Squares
================================ */
const squares = Array.from(document.getElementsByClassName("square"));

const a_1 = document.getElementById("a_1");
const a_2 = document.getElementById("a_2");
const a_3 = document.getElementById("a_3");
const b_1 = document.getElementById("b_1");
const b_2 = document.getElementById("b_2");
const b_3 = document.getElementById("b_3");
const c_1 = document.getElementById("c_1");
const c_2 = document.getElementById("c_2");
const c_3 = document.getElementById("c_3");

/* ===============================
   Judge lines
================================ */
function JudgLine(targetArray, idArray) {
  return targetArray.filter(e =>
    e.id === idArray[0] || e.id === idArray[1] || e.id === idArray[2]
  );
}

const lineArray = [
  JudgLine(squares, ["a_1", "a_2", "a_3"]),
  JudgLine(squares, ["b_1", "b_2", "b_3"]),
  JudgLine(squares, ["c_1", "c_2", "c_3"]),
  JudgLine(squares, ["a_1", "b_1", "c_1"]),
  JudgLine(squares, ["a_2", "b_2", "c_2"]),
  JudgLine(squares, ["a_3", "b_3", "c_3"]),
  JudgLine(squares, ["a_1", "b_2", "c_3"]),
  JudgLine(squares, ["a_3", "b_2", "c_1"])
];

/* ===============================
   Messages
================================ */
const msgtxt = {
  penTurn: '<p class="image"><img src="img/penguins.jpg" width="61"></p><p class="text">Penguins Attack!</p>',
  bearTurn:'<p class="image"><img src="img/whitebear.jpg" width="61"></p><p class="text">WhiteBear Attack!</p>',
  penWin:  '<p class="image"><img src="img/penguins.jpg" width="61"></p><p class="text animate__animated animate__lightSpeedInRight">Penguins Win!!</p>',
  bearWin: '<p class="image"><img src="img/whitebear.jpg" width="61"></p><p class="text animate__animated animate__lightSpeedInLeft">WhiteBear Win!!</p>',
  draw:    '<p class="image"><img src="img/penguins.jpg" width="61"><img src="img/whitebear.jpg" width="61"></p><p class="text animate__animated animate__bounceIn">Draw!!</p>'
};

function setMessage(type) {
  document.getElementById("msgtext").innerHTML = msgtxt[type];
}

/* ===============================
   🔊 Sounds (5 kinds)
================================ */
const gameSound = [
  "sound/click_sound1.mp3",   // Penguins Attack
  "sound/click_sound2.mp3",   // WhiteBear Attack
  "sound/penwin_sound.mp3",   // Penguins Win
  "sound/bearwin_sound.mp3",  // WhiteBear Win
  "sound/draw_sound.mp3"      // Draw
];

function playSound(src) {
  const music = new Audio(src);
  music.currentTime = 0;
  music.play();
}

/* ===============================
   Winner check
================================ */
function isWinner(player) {
  return lineArray.some(line => {
    const win = line.every(square =>
      player === "pen"
        ? square.classList.contains("js-pen-checked")
        : square.classList.contains("js-bear-checked")
    );
    if (win) winningLine = line;
    return win;
  });
}

/* ===============================
   Game Over
================================ */
function gameOver(status) {
  isGameOver = true;

  squares.forEach(s => s.classList.add("js-unclickable"));

  let soundIndex = 4;

  if (status === "pen") {
    winningLine.forEach(s => s.classList.add("js-pen_highLight"));
    soundIndex = 2;
  } else if (status === "bear") {
    winningLine.forEach(s => s.classList.add("js-bear_highLight"));
    soundIndex = 3;
  }

  playSound(gameSound[soundIndex]);

  newGameBtnBox.classList.remove("js-hidden");
}

/* ===============================
   Click square
================================ */
function isSelect(square) {
  if (isGameOver) return;
  if (square.classList.contains("js-pen-checked") || square.classList.contains("js-bear-checked")) return;

  counter--;

  if (flag === "pen-flag") {
    square.classList.add("js-pen-checked");
    playSound(gameSound[0]);

    if (isWinner("pen")) {
      setMessage("penWin");
      gameOver("pen");
      return;
    }

    flag = "bear-flag";
    setMessage("bearTurn");
  } else {
    square.classList.add("js-bear-checked");
    playSound(gameSound[1]);

    if (isWinner("bear")) {
      setMessage("bearWin");
      gameOver("bear");
      return;
    }

    flag = "pen-flag";
    setMessage("penTurn");
  }

  if (counter === 0) {
    setMessage("draw");
    gameOver("draw");
  }
}

/* ===============================
   New Game
================================ */
function resetGame() {
  flag = "pen-flag";
  counter = 9;
  isGameOver = false;
  winningLine = null;

  squares.forEach(s => {
    s.className = "square";
  });

  newGameBtnBox.classList.add("js-hidden");
  setMessage("penTurn");
}

/* ===============================
   Init
================================ */
window.addEventListener("DOMContentLoaded", () => {
  setMessage("penTurn");
});

squares.forEach(sq => {
  sq.addEventListener("click", () => isSelect(sq));
});

newGameBtn.addEventListener("click", resetGame);
