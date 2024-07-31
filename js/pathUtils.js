import { coord, highlightCell } from './grid.js';

const matrix = coord;

/**
 * Get the neighboring cells of the current cell.
 * @param {Object} current - The current cell with x and y coordinates.
 * @param {Array} matrix - The grid matrix.
 * @returns {Array} - An array of neighboring cells.
 */
function getNeighbors(current) {
    const neighbors = [];
    let directions = [];
    let diagonal = document.getElementById('diagonalMovementCheckbox').checked;
    if (diagonal) {
        directions = [
            { dx: -1, dy: 0}, // left
            { dx: 1, dy: 0},  // right
            { dx: 0, dy: -1}, // up
            { dx: 0, dy: 1},  // down
            { dx: -1, dy: -1}, // top-left
            { dx: 1, dy: -1},  // top-right
            { dx: -1, dy: 1},  // bottom-left
            { dx: 1, dy: 1}    // bottom-right
        ];
    } else {
        directions = [
            { dx: -1, dy: 0}, // left
            { dx: 1, dy: 0},  // right
            { dx: 0, dy: -1}, // up
            { dx: 0, dy: 1}  // down
        ];
    }


    for (let { dx, dy} of directions) {
        const newX = current.x + dx;
        const newY = current.y + dy;

        // ensure the diagonal cells are not blocked
        if (!isValidCell(newX, current.y) || !isValidCell(current.x, newY) || 
            matrix[current.y][newX].color === 'black' || matrix[newY][current.x].color === 'black') {
            continue;
        }

        if (isValidCell(newX, newY)) {
            highlightCell(newX, newY, '#87CEEB');
            neighbors.push(matrix[newY][newX]);
        }
    }

    return neighbors;
}

/**
 * Check if a cell is valid (within bounds and not blocked).
 * @param {number} x - The x-coordinate of the cell.
 * @param {number} y - The y-coordinate of the cell.
 * @param {Array} matrix - The grid matrix.
 * @returns {boolean} - True if the cell is valid, false otherwise.
 */
function isValidCell(x, y) {
    return x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length && matrix[y][x].color !== 'black';
}

/**
 * Reconstruct the path from the start to the goal.
 * @param {Map} cameFrom - A map of cells and their predecessors.
 * @param {Object} current - The current cell with x and y coordinates.
 */
function reconstructPath(cameFrom, current) {
    const path = [];
    let pathLength = 0;
    let sum = 0;
    while (current) {
        path.push(current);
        current = cameFrom.get(current);

    }
    for (let cell of path.reverse()) {
        pathLength++;
        sum += coord[cell.y][cell.x].weight
        highlightCell(cell.x, cell.y, 'green');
    };
    document.getElementById('path-length').innerText = pathLength;
    document.getElementById('path-weight').innerText = sum;
}

export { getNeighbors, isValidCell, reconstructPath };