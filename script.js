var draggableDiv;

let offsetX = 0;
let offsetY = 0;
let mouseX = 0;
let mouseY = 0;
isMouseDown = false;

var terminalContent = "";
var terminal = "";
var terminalHead = "";

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
  draggableDiv.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

async function setUpTerminal(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", 'terminal/terminal.html', true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      terminal += xhr.responseText;
      document.getElementById("body").innerHTML += terminal;
    }
  };
  xhr.send();
}

async function setUpTerminalHead(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", 'terminal/terminalHead.html', true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      terminalHead = xhr.responseText;
      document.getElementById("targetDiv").innerHTML += terminalHead;
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
      document.getElementById("targetDiv").innerHTML = terminalHead + terminalContent;
      //re add the eventListeners
      addEventListeners();
    }
  };
  xhr.send();
}

//load the initial content to the terminal
document.addEventListener("DOMContentLoaded", (e) => {
  setUpTerminal().then(setUpTerminalHead).then( (e) => {
    loadContentIntoTerminal("list.html");
  })
});
