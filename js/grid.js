// Drawing to an HTML Canvas element
const gridContainer = document.getElementById('grid-container');
const overlay = document.getElementById('overlay');
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const cursorPositionDiv = document.getElementById('cursorPosition');

// size of each grid cell and dimensions of the grid
const cellSize = 50;
const gridWidth = 20 * cellSize;
const gridHeight = 20 * cellSize;

canvas.width = gridWidth;
canvas.height = gridHeight;

gridContainer.appendChild(canvas);
// coordinates
let coord = [];

const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

let debug = false;

// debug mode
function debugMode() {
    debug = !debug;
    if (debug) {
        // Draw the bounding box of the canvas
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        console.log(canvas.width, canvas.height);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const coordinates = document.createElement('div');
                coordinates.className = 'overlay-coordinates';
                coordinates.innerText = `(${col}, ${row})`;
                coordinates.style.left = `${col * cellSize + 5}px`;
                coordinates.style.top = `${row * cellSize + 5}px`;
                overlay.appendChild(coordinates);
            }
        }
        console.log(coord);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ccc'; // draw thin lines
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (coord[row][col].color !== null) {
                    ctx.fillStyle = coord[row][col].color;
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
                ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
        overlay.innerHTML = '';
        cursorPositionDiv.style.display = 'none';
        console.log(coord);
    }
}

// draw the grid
function drawGrid() {
    // Origin is top left (0, 0)
    // Draw the grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ccc'; // draw thin lines
    for (let row = 0; row < rows; row++) {
        coord[row] = [];
        for (let col = 0; col < cols; col++) {
            coord[row][col] = { x: col * cellSize, y: row * cellSize, highlighted: false, color: null };
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }

    highlightCell(0, 0, 'blue'); // start
    highlightCell((cols - 1) * cellSize, (rows - 1) * cellSize, 'red'); // end

    if (debug) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
};

// highlight a cell
function highlightCell(x, y, color = 'black') {
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    ctx.strokeStyle = '#ccc';

    if (row >= 0 && row < coord.length && col >= 0 && col < coord[row].length) {
        const cell = coord[row][col];
        if (!cell.highlighted) {
            ctx.fillStyle = color;
            ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
            ctx.strokeRect(cell.x, cell.y, cellSize, cellSize);
            cell.highlighted = true;
            cell.color = color;
        } else {
            ctx.clearRect(cell.x, cell.y, cellSize, cellSize);
            ctx.strokeRect(cell.x, cell.y, cellSize, cellSize);
            cell.highlighted = false;
            cell.color = null;
        }
    }
    
    //console.log(coord)
}

// generate a random maze
function genRandMaze() {
    clearGrid();
    const Input = document.getElementById('wallChance');
    const wallChance = parseInt(Input.value) / 100;

    for (let row = 1; row < rows - 1; row++) {
        for (let col = 1; col < cols - 1; col++) {
            if (Math.random() < wallChance) { // Create a rand wall
                highlightCell(col * cellSize, row * cellSize);
            }
        }
    }
}

// clear grid
function clearGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coord = [];
    drawGrid();
}

// get the cursor position
function getCursorPosition(event, rect) {
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    return { x, y, col, row };
}

// initialization and event listeners
function init() {
    drawGrid();

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const { x, y, col, row } = getCursorPosition(event, rect);
        if (debug) {
            cursorPositionDiv.style.display = 'block';
            cursorPositionDiv.style.color = 'white';
            cursorPositionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            cursorPositionDiv.style.padding = '5px';
            cursorPositionDiv.style.borderRadius = '5px';
            cursorPositionDiv.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
            cursorPositionDiv.style.position = 'absolute';
            cursorPositionDiv.style.pointerEvents = 'none';
            cursorPositionDiv.style.left = `${x + 10}px`;
            cursorPositionDiv.style.top = `${y - 10}px`;
            cursorPositionDiv.innerText = `(${x}, ${y})\nCoord: [${col}, ${row}]`;
            // console.log(`Cursor position: (${x}, ${y})`);
            // console.log(`Coord position: (${coord[row][col].x / cellSize}, ${coord[row][col].y / cellSize})`);
        }
    });

    canvas.addEventListener('mouseup', function(event) {
        const rect = canvas.getBoundingClientRect();
        const { x, y, col, row } = getCursorPosition(event, rect);
        if (coord[row][col].color === 'blue' || coord[row][col].color === 'red') return;
        highlightCell(x, y);
    });

};


export {coord, init, clearGrid, genRandMaze, debugMode};