import { highlightCell, clearGrid, blueCellPosition, redCellPosition } from './grid.js';
import { PriorityQueue } from './p_queue.js';
import { Statistics } from './statistics.js';
import { getNeighbors, reconstructPath } from './pathUtils.js';

let running = false;
export let stats = new Statistics('A*');

/**
 * Heuristic function to estimate the cost from the current node to the goal.
 * @param {Object} start - The starting node with x and y coordinates.
 * @param {Object} goal - The goal node with x and y coordinates.
 * @returns {number} - The estimated cost to reach the goal.
 */
function heuristic(start, goal) {
    let selectedHeuristic = document.getElementById('heuristicDropdown').value.trim();
    console.log(selectedHeuristic);
    switch (selectedHeuristic.toLowerCase()) {
        case 'manhattan':
            return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y); // |x2 - x1| + |y2 - y1|
        case 'euclidean':
            return Math.sqrt(Math.pow(start.x - goal.x, 2) + Math.pow(start.y - goal.y, 2)); // sqrt((x2 - x1)^2 + (y2 - y1)^2)
        case 'chebyshev':
            return Math.max(Math.abs(start.x - goal.x), Math.abs(start.y - goal.y)); // max(|x2 - x1|, |y2 - y1|)
        case 'octile':
            let dx = Math.abs(start.x - goal.x);
            let dy = Math.abs(start.y - goal.y);
            return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy); // |x2 - x1| + |y2 - y1| + (sqrt(2) - 2) * min(|x2 - x1|, |y2 - y1|)
        default:
            return 0;
    }
}

/**
 * A* pathfinding algorithm to find the shortest path from the start node to the goal node.
 * Uses a priority queue to explore the most promising nodes first.
 */
export async function aStar() {
    clearGrid();
    stats.reset();

    running = true;
    const start = {x: blueCellPosition.x , y: blueCellPosition.y};
    const goal = {x: redCellPosition.x , y: redCellPosition.y};

    const frontier = new PriorityQueue(); // keep track of the cells to visit
    const evaluated = new Set(); // keep track of the cells that have been visited
    const cost = new Map(); // keep track of the cost to reach a cell
    const totalCost = new Map(); // keep track of the total cost to reach a cell

    const cameFrom = new Map(); // keep track of the optimal path

    cost.set(start, 0);
    totalCost.set(start, heuristic(start, goal));
    frontier.enqueue(start, totalCost.get(start));
    stats.startTimer();
    while (!frontier.isEmpty() && running) {
        stats.step();

        const current = frontier.dequeue();

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
                weight *= 1.5; // Increase the cost for diagonal movement
            }
            const potentialCost = cost.get(current) + weight;

            if (!cost.has(neighbor) || potentialCost < cost.get(neighbor)) { // check if the new path is better
                cameFrom.set(neighbor, current);
                cost.set(neighbor, potentialCost);
                totalCost.set(neighbor, potentialCost + heuristic(neighbor, goal));

                if (!frontier.elements.some(e => e.element === neighbor)) { // check if the cell is already in the frontier
                    frontier.enqueue(neighbor, totalCost.get(neighbor)); // add the cell to the frontier

                    highlightCell(neighbor.x, neighbor.y, '#FFD700');
                    stats.visit();
                }
            }

        // Visualize the current step
        highlightCell(current.x, current.y, '#FFD700'); // Light blue for current cell
        stats.stopTimer();
        stats.update();
        if (!document.getElementById('sleep').checked) await sleep(10); // Pause to visualize
        }
    }
}

/**
 * Pause execution for a given number of milliseconds.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} - A promise that resolves after the specified time.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Stop the A* algorithm.
 */
export function stop() {
    if (running) {
        stats.stopTimer();
        stats.update();
    }
    running = false;
}