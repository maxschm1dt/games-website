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
  wordleButton = document.getElementById("wordleButton");
  draggableDiv.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  if (wordleButton != null) {
    wordleButton.addEventListener("click", (e) => {
      loadContentExclusiveIntoTerminal("wordleSolver/index.html");
      wordleLoaded = true;
    });
  }

  if (wordleLoaded) {
    document
      .getElementById("wordleExitButton")
      .addEventListener("click", (e) => {
        loadContentIntoTerminal("list/list.html");
        wordleLoaded = false;
      });
    document
      .getElementById("wordleReloadButton")
      .addEventListener("click", (e) => {
        wordleReload();
      });
  }
}

function wordleReload() {
	var inputStringGreen = String(document.getElementById("wordleGreenLetters").value);
	let resultArrayGreen = inputStringGreen.split(/\|/);
	resultArrayGreen = resultArrayGreen.map(element => element.trim());


	var inputStringYellow = String(document.getElementById("wordleYellowLetters").value);
	var inputStringNot = String(document.getElementById("wordleUnusedLetters").value);
	
	let resultArrayYellow = inputStringYellow.split('').filter(char => char.trim() !== '');
	let resultArrayNot = inputStringNot.split('').filter(char => char.trim() !== '');

	getWords(resultArrayGreen, resultArrayYellow, resultArrayNot);
}

export function updateWordleWords(best, possible) {
	document.getElementById('wordlePossibleWords').innerHTML = ' possible words: ' + possible;
	document.getElementById('wordleBestWord').innerHTML = ' best next word: ' + best;
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
      document.getElementById("targetDiv").innerHTML =
        terminalHead + terminalContent + emptyCommand;
      //re add the eventListeners
      addEventListeners();
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
    .then(setUpEmptyCommand)
    .then((e) => {
      loadContentIntoTerminal("list/list.html");
    });
});
