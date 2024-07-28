// Drawing to an HTML Canvas element
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// size of each grid cell
const cellSize = 50;

// coordinates
let coord = [];

const sidebar = document.getElementById('sidebar');
const sidebarWidth = sidebar.offsetWidth;

canvas.width = window.innerWidth - sidebarWidth;
canvas.height = window.innerHeight;

const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

let debug = false;

function debugMode() {
    debug = !debug;
    drawGrid(debug);
}

// Function to draw the grid
function drawGrid(debug = false) {
    // Origin is top left (0, 0)
    // Draw the grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ccc'; // draw thin lines
    for (let row = 0; row < rows; row++) {
        coord[row] = [];
        for (let col = 0; col < cols; col++) {
            coord[row][col] = { x: col * cellSize, y: row * cellSize, highlighted: false, color: null };
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (debug) {
                // Draw coordinates in the center of each cell
                ctx.font = '12px Arial';
                ctx.fillStyle = 'green';
                const text = `(${col}, ${row})`;
                const textX = col * cellSize + cellSize / 4;
                const textY = row * cellSize + cellSize / 2;
                ctx.fillText(text, textX, textY);
            }
        }
    }

    if (debug) {
        // Draw the bounding box of the canvas
        ctx.strokeStyle = 'red'; // color for the bounding box
        ctx.lineWidth = 2; // thickness of the bounding box
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        console.log(canvas.width, canvas.height);
    }

    highlightCell(0, 0, 'blue'); // start
    highlightCell((cols - 1) * cellSize, (rows - 1) * cellSize, 'red'); // end
};

// Function to highlight a cell
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

// Function to generate a random maze
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

// Function to clear grid
function clearGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coord = [];
    drawGrid();
}

function getCursorPosition(event, rect) {
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    return { x, y, col, row };
}

// Draw the grid initially
function init() {
    drawGrid();

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const { x, y, col, row } = getCursorPosition(event, rect);
        console.log(`Cursor position: (${x}, ${y})`);
        console.log(`Coord position: (${coord[row][col].x / cellSize}, ${coord[row][col].y / cellSize})`);
    });

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const { x, y, col, row } = getCursorPosition(event, rect);
        if (coord[row][col].color === 'blue' || coord[row][col].color === 'red') return;
        highlightCell(x, y);
    });

};


export {coord, init, clearGrid, genRandMaze, debugMode};