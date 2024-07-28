import { coord, highlightCell, clearGrid } from './grid.js';
import { PriorityQueue } from './p_queue.js';

const matrix = coord;
let steps = 0;
let pathLength = 0;
let running = false;
let startTime;

function manhattanHeuristic(start, goal) {
    //console.log( start.x, start.y, goal.x, goal.y);
    return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}

export async function aStar() {
    clearGrid();
    let steps = 0;
    pathLength = 0
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
    //console.log(blueCellPosition);

    let redCellPosition;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].color === 'red') {
                redCellPosition = { x: j, y: i };
                break;
            }
        }
        if (redCellPosition) {
            break;
        }
    }
    //console.log(redCellPosition);

    running = true;
    const start = {x: blueCellPosition.x , y: blueCellPosition.y};
    const goal = {x: redCellPosition.x , y: redCellPosition.y};
    const openList = new PriorityQueue();
    const closedList = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const cameFrom = new Map();

    gScore.set(start, 0);
    fScore.set(start, manhattanHeuristic(start, goal));
    //console.log(gScore, fScore);
    openList.enqueue(start, fScore.get(start));
    startTime = Date.now();
    while (!openList.isEmpty() && running) {
        steps++;
        document.getElementById('steps').innerText = steps;

        const current = openList.dequeue();

        if (current.x === goal.x && current.y === goal.y) {
            const endTime = Date.now();
            const timeTaken = endTime - startTime;
            updateStats(steps, timeTaken);
            return reconstructPath(cameFrom, current);
        }

        closedList.add(current);

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            if (closedList.has(neighbor)) {
                continue;
            }

            const tentativeGScore = gScore.get(current) + 0;

            if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + manhattanHeuristic(neighbor, goal));

                if (!openList.elements.some(e => e.element === neighbor)) {
                    openList.enqueue(neighbor, fScore.get(neighbor));
                    highlightCell(neighbor.x, neighbor.y, '#FFD700');
                }
            }

        // Visualize the current step
        highlightCell(current.x, current.y, '#FFD700'); // Light blue for current cell
        updateStats(steps, Date.now() - startTime);
        await sleep(10); // Pause for 100ms to visualize
        }
    }

    return []; // No path found
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
            highlightCell(newX, newY, '#87CEEB');
            neighbors.push(matrix[newY][newX]);
        }
    }

    return neighbors;
}

function isValidCell(x, y) {
    return x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length && matrix[y][x].color !== 'black';
}

function reconstructPath(cameFrom, current) {
    const path = [];
    while (current) {
        path.push(current);
        current = cameFrom.get(current);

    }
    for (let cell of path.reverse()) {
        pathLength++;
        document.getElementById('path-length').innerText = pathLength;
        highlightCell(cell.x, cell.y, 'green');
    };
}

function updateStats(steps = 0, time = 0, pathLength = 0) {
    document.getElementById('algorithm-name').innerText = 'A*';
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