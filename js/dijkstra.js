import { highlightCell, clearGrid, blueCellPosition, redCellPosition } from './grid.js';
import { PriorityQueue } from './p_queue.js';
import { Statistics } from './statistics.js';
import { getNeighbors, reconstructPath } from './pathUtils.js';

let running = false;
export let stats = new Statistics('Dijkstra');

/**
 * Runs the Dijkstra algorithm to find the shortest path.
 * @returns {Promise<void>}
 */
export async function dijkstra() {
    stats.reset();
    clearGrid();

    running = true;
    const start = {x: blueCellPosition.x , y: blueCellPosition.y};
    const goal = {x: redCellPosition.x , y: redCellPosition.y};

    const frontier = new PriorityQueue(); // keep track of the cells to visit
    const evaluated = new Set(); // keep track of the cells that have been visited
    const cost = new Map(); // keep track of the cost to reach a cell

    const cameFrom = new Map(); // keep track of the optimal path


    cost.set(start, 0);
    frontier.enqueue(start, 0);
    stats.startTimer();
    while (!frontier.isEmpty() && running) {
        stats.step();

        const current = frontier.dequeue();
        // Highlight the current cell
        highlightCell(current.x, current.y, '#87CEEB');


        // Reached Goal
        if (current.x === goal.x && current.y === goal.y) {
            stats.stopTimer();
            stats.update();
            return reconstructPath(cameFrom, current);
        }

        evaluated.add(current);

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            stats.step();
            if (evaluated.has(neighbor)) { // check if the cell has been visited already
                continue;
            }

            let weight = neighbor.weight || 1; // default weight is 1
            // Increase weight for diagonal movement
            if (current.x !== neighbor.x && current.y !== neighbor.y) {
                weight = Math.sqrt(Math.pow(weight, 2) + Math.pow(weight, 2)); // Increase the cost for diagonal movement
            }
            const potentialCost = cost.get(current) + weight;

            if (!cost.has(neighbor) || potentialCost < cost.get(neighbor)) { // check if the new path is better
                cameFrom.set(neighbor, current);
                cost.set(neighbor, potentialCost);

                if (!frontier.elements.some(e => e.element === neighbor)) { // check if the cell is already in the frontier
                    frontier.enqueue(neighbor, potentialCost); // Use potentialCost as priority

                    // Highlight the promising cell
                    highlightCell(neighbor.x, neighbor.y, '#FFD700');
                    stats.visit();
                }
            }

        stats.stopTimer();
        stats.update();
        if (!document.getElementById('sleep').checked) await sleep(10); // Pause to visualize
        }
    }
}

/**
 * Pauses execution for a given number of milliseconds.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Stops the Dijkstra algorithm.
 */
export function stop() {
    running = false;
    stats.stopTimer();
    stats.update();
}