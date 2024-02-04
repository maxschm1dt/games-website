import { getWords } from "./wordleSolver/wordleSolver.js";

var draggableDiv;
var wordleButton;

let offsetX = 0;
let offsetY = 0;
let mouseX = 0;
let mouseY = 0;
var isMouseDown = false;
var wordleLoaded = false;

var terminalContent = "";
var terminal = "";
var terminalHead = "";
var emptyCommand = "";
var spacer = "";

function onMouseDown(e) {
  isMouseDown = true;
  offsetX = draggableDiv.parentElement.offsetLeft - e.clientX;
  offsetY = draggableDiv.parentElement.offsetTop - e.clientY;
}

function onMouseMove(e) {
  if (!isMouseDown) return;
  e.preventDefault();
  mouseX = e.clientX + offsetX;
  mouseY = e.clientY + offsetY;
  draggableDiv.parentElement.style.position = "absolute";
  draggableDiv.parentElement.style.left = mouseX + "px";
  draggableDiv.parentElement.style.top = mouseY + "px";
}

function onMouseUp(e) {
  isMouseDown = false;
}

function addEventListeners() {
  draggableDiv = document.getElementById("drag");
  wordleButton = [...document.getElementsByName("wordleButton")].pop();
  draggableDiv.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  if (wordleButton != null) {
    wordleButton.addEventListener("click", (e) => {
      loadContentIntoTerminal("wordleSolver/index.html");
      wordleLoaded = true;
    });
  }

  if (wordleLoaded) {
    [...document.getElementsByName("wordleExitButton")]
      .pop()
      .addEventListener("click", (e) => {
        loadContentIntoTerminal("list/list.html");
        wordleLoaded = false;
      });
    [...document.getElementsByName("wordleReloadButton")]
      .pop()
      .addEventListener("click", (e) => {
        wordleReload();
      });
  }
}

function wordleReload() {
  var inputStringGreen = String(
    [...document.getElementsByName("wordleGreenLetters")].pop().value
  ).toUpperCase();
  let resultArrayGreen = inputStringGreen.split(/\|/);
  resultArrayGreen = resultArrayGreen.map((element) => element.trim());

  var inputStringYellow = String(
    [...document.getElementsByName("wordleYellowLetters")].pop().value
  ).toUpperCase();
  var inputStringNot = String(
    [...document.getElementsByName("wordleUnusedLetters")].pop().value
  ).toUpperCase();

  let resultArrayYellow = inputStringYellow
    .split(/\|/);
	resultArrayYellow = resultArrayYellow.map((element) => element.trim());

  let resultArrayNot = inputStringNot
    .split("")
    .filter((char) => char.trim() !== "");

	console.log(resultArrayYellow);

  getWords(resultArrayGreen, resultArrayYellow, resultArrayNot);
}

export function updateWordleWords(best, possible) {
	var words = [...possible].slice(0, 10);
  [...document.getElementsByName("wordlePossibleWords")].pop().innerHTML =
    " " + words.length + " of " + [...possible].length + " possible words: "+ words;
  [...document.getElementsByName("wordleBestWord")].pop().innerHTML =
    " best next word: " + best;
}

async function setUpTerminal() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "terminal/terminal.html", true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      terminal += xhr.responseText;
      document.getElementById("body").innerHTML += terminal;
    }
  };
  xhr.send();
}

async function setUpTerminalSpacer() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "terminal/spacer.html", true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      spacer = xhr.responseText;
      document.getElementById("targetDiv").innerHTML += spacer;
    }
  };
  xhr.send();
}

async function setUpTerminalHead() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "terminal/terminalHead.html", true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      terminalHead = xhr.responseText;
      document.getElementById("targetDiv").innerHTML += terminalHead;
    }
  };
  xhr.send();
}

async function setUpEmptyCommand() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "terminal/emptyCommand.html", true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      emptyCommand = xhr.responseText;
    }
  };
  xhr.send();
}

function loadContentIntoTerminal(content) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", content, true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      terminalContent += xhr.responseText;
      var targetDiv = document.getElementById("targetDiv");
      targetDiv.innerHTML =
        terminalHead + spacer + terminalContent + emptyCommand;
      //re add the eventListeners
      addEventListeners();
      targetDiv.scrollTop = targetDiv.scrollHeight;
    }
  };
  xhr.send();
}

function loadContentExclusiveIntoTerminal(content) {
  terminalContent = "";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", content, true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.getElementById("targetDiv").innerHTML =
        terminalHead + xhr.responseText;
      //re add the eventListeners
      addEventListeners();
    }
  };
  xhr.send();
}

//load the initial content to the terminal
document.addEventListener("DOMContentLoaded", (e) => {
  setUpTerminal()
    .then(setUpTerminalHead)
    .then(setUpTerminalSpacer)
    .then(setUpEmptyCommand)
    .then((e) => {
      loadContentIntoTerminal("list/list.html");
    });
});
