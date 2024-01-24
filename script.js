// Get the Div element
const draggableDiv = document.getElementById('drag');
console.log(draggableDiv);

// Initialize the position variables

let offsetX = 0;
let offsetY = 0;
let mouseX = 0;
let mouseY = 0;
isMouseDown = false;

// Mouse down event

draggableDiv.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    offsetX = draggableDiv.parentElement.offsetLeft - e.clientX;
    offsetY = draggableDiv.parentElement.offsetTop - e.clientY;
});

// Mouse move event
document.addEventListener('mousemove', (e) => {
    if(!isMouseDown) return;
    e.preventDefault(); 
    mouseX = e.clientX + offsetX;
    mouseY = e.clientY + offsetY;
    draggableDiv.parentElement.style.position = 'absolute';
    draggableDiv.parentElement.style.left = mouseX + 'px';
    draggableDiv.parentElement.style.top = mouseY + 'px';
});

// Mouse up event
document.addEventListener('mouseup', (e) => {
    isMouseDown = false;
});