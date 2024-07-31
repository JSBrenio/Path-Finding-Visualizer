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
let blueCellPosition;
let redCellPosition;

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
            coord[row][col] = { x: col, y: row, highlighted: false, color: null };
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }

    highlightCell(0, 0, 'blue'); // start
    highlightCell((cols - 1), (rows - 1), 'red'); // end
    blueCellPosition = {x: 0, y: 0};
    redCellPosition = {x: (cols - 1), y: (rows - 1)};

    if (debug) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
    //console.log(coord);
};

// highlight a cell
function highlightCell(x, y, color = 'black') {
    const col = x;
    const row = y;
    const cell = coord[row][col];
    const pixelX = cell.x * cellSize;
    const pixelY = cell.y * cellSize;

    if (debug) {
        console.log(col, row);
        console.log(coord[row][col]);
        console.log(x, y)
    }
    ctx.strokeStyle = '#ccc';
    // don't override the start and end cells
    if ((coord[row][col].color === 'blue' && color !== 'blue') || (coord[row][col].color === 'red' && color !== 'red')) {
        return;
    }
    if (coord[row][col].color !== 'black' && coord[row][col].color !== null) {
        if (row >= 0 && row < coord.length && col >= 0 && col < coord[row].length) {
            ctx.fillStyle = color;
            ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
            ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
            cell.highlighted = true;
            cell.color = color;
        }
    }
    else if (row >= 0 && row < coord.length && col >= 0 && col < coord[row].length) {
        if (!cell.highlighted) {
            ctx.fillStyle = color;
            ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
            ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
            cell.highlighted = true;
            cell.color = color;
        } else {
            ctx.clearRect(pixelX, pixelY, cellSize, cellSize);
            ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
            cell.highlighted = false;
            cell.color = null;
        }
    }
    
    //console.log(coord)
}

// generate a random maze
function genRandMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const slider = document.getElementById('wallChanceSlider');
    const wallChance = parseInt(slider.value) / 100;

    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);
    const endRow = Math.floor(Math.random() * rows);
    const endCol = Math.floor(Math.random() * cols);

    // generate random walls
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            coord[row][col] = { x: col, y: row, highlighted: false, color: null };
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (coord[row][col].color !== 'black' && coord[row][col].color !== null) {
                let cell = coord[row][col];
                cell.highlighted = false;
                cell.color = null;
                continue;
            }
            if (Math.random() < wallChance) { // Create a rand wall
                highlightCell(col, row);
            }
        }
    }
    // remove black block if randomly generated on one
    if (coord[startRow][startCol].color === 'black' || coord[endRow][endCol].color === 'black') {
        var cell = coord[startRow][startCol];
        cell.highlighted = false;
        cell.color = null;
        cell = coord[endRow][endCol];
        cell.color = null;
        cell.highlighted = false;
    }
    highlightCell(startCol, startRow, 'blue'); // start
    highlightCell(endCol, endRow, 'red'); // end
    blueCellPosition = {x: startCol, y: startRow};
    redCellPosition = {x: endCol, y: endRow};
}

// clear grid
function clearGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (coord[row][col].color !== 'black' && coord[row][col].color !== 'blue' && coord[row][col].color !== 'red') {
                coord[row][col].color = null;
                coord[row][col].highlighted = false;
            }
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (coord[row][col].color === null) continue;
            coord[row][col].highlighted = false;
            highlightCell(col, row, coord[row][col].color);
        }
    }
}

function resetGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        if (coord[row][col].color !== 'black' && coord[row][col].color !== null) return;
        highlightCell(col, row);
    });

};

export {coord, init, clearGrid, genRandMaze, debugMode, highlightCell, resetGrid, blueCellPosition, redCellPosition};