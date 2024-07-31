import { coord, highlightCell, clearGrid, blueCellPosition, redCellPosition } from './grid.js';
import { PriorityQueue } from './p_queue.js';
import { Statistics } from './statistics.js';

const matrix = coord;
let running = false;
export let stats = new Statistics('Dijkstra');

export async function dijkstra() {
    stats.reset();
    clearGrid();

    running = true;
    const start = {x: blueCellPosition.x , y: blueCellPosition.y};
    const goal = {x: redCellPosition.x , y: redCellPosition.y};
    const frontier = new PriorityQueue();
    const evaluated = new Set();
    const cost = new Map();
    const totalCost = new Map();
    const cameFrom = new Map();

    cost.set(start, 0);
    frontier.enqueue(start, 0);
    stats.startTimer();
    while (!frontier.isEmpty() && running) {
        stats.step();
        document.getElementById('steps').innerText = steps;

        const current = frontier.dequeue();

        if (current.x === goal.x && current.y === goal.y) {
            stats.stopTimer();
            stats.updateStats();
            return reconstructPath(cameFrom, current);
        }

        evaluated.add(current);

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            if (evaluated.has(neighbor)) {
                continue;
            }

            const tentativecost = cost.get(current);
            if (!cost.has(neighbor) || tentativecost < cost.get(neighbor)) {
                cameFrom.set(neighbor, current);
                cost.set(neighbor, tentativecost);
                if (!frontier.elements.some(e => e.element === neighbor)) {
                    stats.visit();
                    frontier.enqueue(neighbor, totalCost.get(neighbor));
                    highlightCell(neighbor.x, neighbor.y, '#FFD700');
                }
            }

        // Visualize the current step
        highlightCell(current.x, current.y, '#FFD700'); // Light blue for current cell
        stats.stopTimer();
        stats.update();
        if (!document.getElementById('sleep').checked) await sleep(10); // Pause to visualize
        }
    }

    return []; // No path found
}

function getNeighbors(current) {
    const neighbors = [];
    let directions = [];
    let diagonal = document.getElementById('diagonalMovementCheckbox').checked;
    if (diagonal) {
        directions = [
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: -1 }, // top-left
            { dx: 1, dy: -1 },  // top-right
            { dx: -1, dy: 1 },  // bottom-left
            { dx: 1, dy: 1 }    // bottom-right
        ];
    } else {
        directions = [
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 }  // down
        ];
    }


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
        stats.path();
        document.getElementById('path-length').innerText = pathLength;
        highlightCell(cell.x, cell.y, 'green');
    };
    stats.update();
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