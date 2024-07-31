import { coord, highlightCell, clearGrid } from './grid.js';
import { PriorityQueue } from './p_queue.js';
import { Statistics } from './statistics.js';

const matrix = coord;
let running = false;
export let stats = new Statistics('A*');

function manhattanHeuristic(start, goal) {
    //console.log( start.x, start.y, goal.x, goal.y);
    return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}

export async function aStar() {
    clearGrid();
    stats.reset();
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
    const frontier = new PriorityQueue();
    const evaluated = new Set();
    const cost = new Map();
    const totalCost = new Map();
    const cameFrom = new Map();

    cost.set(start, 0);
    totalCost.set(start, manhattanHeuristic(start, goal));
    //console.log(cost, totalCost);
    frontier.enqueue(start, totalCost.get(start));
    stats.startTimer();
    while (!frontier.isEmpty() && running) {
        stats.step();

        const current = frontier.dequeue();

        if (current.x === goal.x && current.y === goal.y) {
            stats.stopTimer();
            stats.update();
            return reconstructPath(cameFrom, current);
        }

        evaluated.add(current);

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            if (evaluated.has(neighbor)) {
                continue;
            }
            let weight = 0;
            
            const tentativecost = cost.get(current) + weight;

            if (!cost.has(neighbor) || tentativecost < cost.get(neighbor)) {
                cameFrom.set(neighbor, current);
                cost.set(neighbor, tentativecost);
                totalCost.set(neighbor, tentativecost + manhattanHeuristic(neighbor, goal));

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
        await sleep(10); // Pause for 100ms to visualize
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
        highlightCell(cell.x, cell.y, 'green');
    };
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