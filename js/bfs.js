import { highlightCell, blueCellPosition } from './grid.js';
import { Queue } from './queue.js';
import { Statistics } from './statistics.js';
import { getNeighbors, reconstructPath } from './pathUtils.js';

let running = false;
export let stats = new Statistics('Breadth First Search');

/**
 * Performs the Breadth-First Search (BFS) algorithm to find the shortest path.
 * Highlights cells as they are visited and updates statistics.
 * 
 * @async
 * @function bfs
 * @returns {Promise<void>}
 */
export async function bfs() {
    stats.reset();
    clearGrid();
    let start = {x: blueCellPosition.x, y: blueCellPosition.y};
    running = true;

    const frontier = new Queue();
    const reached = new Set();
    const cameFrom = new Map();

    frontier.enqueue(start);
    reached.add(start);
    cameFrom.set(start, null);

    stats.startTimer();

    while (!frontier.isEmpty() && running) {
        const current = frontier.dequeue();

        // Highlight the current cell
        highlightCell(current.x, current.y, '#87CEEB');
        stats.step();

        // Check if the current cell is the target cell
        if (current.color === 'red') {
            running = false;
            reconstructPath(cameFrom, current);
            running = false;
        }

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            if (!reached.has(neighbor)) {
                frontier.enqueue(neighbor);
                stats.visit();

                // Highlight the visited cell
                highlightCell(neighbor.x, neighbor.y, '#FFD700');
                if (neighbor.color === 'red') {
                    running = false;
                    cameFrom.set(neighbor, current);
                    return reconstructPath(cameFrom, neighbor);
                }
                reached.add(neighbor);
                cameFrom.set(neighbor, current);
            }
        }
        if (!document.getElementById('sleep').checked) await sleep(10); // Pause to visualize

        // Update the timer display
        stats.stopTimer();
        stats.update();
    }

    stats.stopTimer();
    stats.update();
}

/**
 * Pauses execution for a specified number of milliseconds.
 * 
 * @function sleep
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Stops the BFS algorithm.
 * 
 * @function stop
 */
export function stop() {
    if (running) {
        stats.stopTimer();
        stats.update();
    }
    running = false;
}