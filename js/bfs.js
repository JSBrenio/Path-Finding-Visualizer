import { coord, highlightCell } from './grid.js';
import { Queue } from './queue.js';
import { Statistics } from './statistics.js';

const matrix = coord;
let frontier;
let reached;
let running = false;
let startTime;
export let stats = new Statistics('Breadth First Search');

// Breadth First Search
export async function bfs() {
    stats.reset();
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
    let start = matrix[y][x];
    running = true;

    frontier = new Queue();
    reached = new Set();
    parent = new Map();

    frontier.enqueue(start);
    reached.add(start);
    parent.set(start, null);

    stats.startTimer();

    while (!frontier.isEmpty() && running) {
        const current = frontier.dequeue();
        highlightCell(current.x, current.y, '#FFD700'); // Gold
        stats.step();

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
                stats.visit();
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
        stats.stopTimer();
        stats.update();
    }

    stats.stopTimer();
    stats.update();
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
        stats.path();
        highlightCell(cell.x, cell.y, 'green');
        cell = parent.get(cell);
    }
    stats.update();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function stop() {
    if (running) {
        stats.stopTimer();
        stats.update();
    }
    running = false;
}