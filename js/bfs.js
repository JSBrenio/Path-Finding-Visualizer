import { coord, highlightCell } from './grid.js';
import { Queue } from './queue.js';

const matrix = coord;
let frontier;
let reached;
let steps;
let pathLength;
let running = false;
let startTime;

// Breadth First Search
export async function bfs() {
    clearGrid();
    let blueCellPosition;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].color === 'blue') {
                blueCellPosition = { x: j, y: i };
                break;
            }
        }
        if (blueCellPosition) {
            break;
        }
    }
    let {x, y} = blueCellPosition;
    running = true;

    frontier = new Queue();
    reached = new Set();
    steps = 0;
    pathLength = 0;
    parent = new Map();

    frontier.enqueue(matrix[y][x]);
    reached.add(matrix[y][x]);
    parent.set(matrix[y][x], null);

    startTime = Date.now();

    while (!frontier.isEmpty() && running) {
        const current = frontier.dequeue();
        highlightCell(current.x, current.y, '#FFD700'); // Gold
        steps++;
        document.getElementById('steps').innerText = steps;

        // Check if the current cell is the target cell
        if (current.color === 'red') {
            running = false;
            drawPath(parent, current);
            running = false;
        }

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            if (!reached.has(neighbor)) {
                frontier.enqueue(neighbor);
                highlightCell(neighbor.x, neighbor.y, '#FFD700'); // Sky Blue
                if (neighbor.color === 'red') {
                    running = false;
                    parent.set(neighbor, current);
                    drawPath(parent, neighbor);
                    running = false;
                }
                reached.add(neighbor);
                parent.set(neighbor, current);
            }
        }
        await sleep(10); // delay for visualization

        // Update the timer display
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;
        updateStats(steps, timeElapsed, pathLength);

    }

    const endTime = Date.now();
    const totalTimeElapsed = endTime - startTime;

    // Update stats in the sidebar
    updateStats(steps, totalTimeElapsed, pathLength);
}

function getNeighbors(current) {
    const neighbors = [];
    const directions = [
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 },  // right
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 }   // down
    ];

    for (let { dx, dy } of directions) {
        const newX = current.x + dx;
        const newY = current.y + dy;
        if (isValidCell(newX, newY)) {
            highlightCell(current.x, current.y, '#87CEEB'); // Gold
            neighbors.push(matrix[newY][newX]);
        }
    }

    return neighbors;
}

function isValidCell(x, y) {
    return x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length && matrix[y][x].color !== 'black';
}

function drawPath(parent, cell) {
    while (cell !== null) {
        pathLength++;
        highlightCell(cell.x, cell.y, 'green');
        cell = parent.get(cell);
    }
    document.getElementById('path-length').innerText = pathLength;
}

function updateStats(steps = 0, time = 0, pathLength = 0) {
    document.getElementById('algorithm-name').innerText = 'BFS';
    if (!running) return;
    document.getElementById('steps').innerText = steps;
    document.getElementById('time').innerText = time;
    document.getElementById('path-length').innerText = pathLength;
}

export function saveCurrentResults() {
    document.getElementById('prev-steps').innerText = document.getElementById('steps').innerText;
    document.getElementById('prev-time').innerText = document.getElementById('time').innerText;
    document.getElementById('prev-path-length').innerText = document.getElementById('path-length').innerText;
    document.getElementById('prev-algorithm-name').innerText = document.getElementById('algorithm-name').innerText;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function stop() {
    running = false;
    const endTime = Date.now();
    const totalTimeElapsed = endTime - startTime;
    updateStats(steps, totalTimeElapsed, pathLength);
}