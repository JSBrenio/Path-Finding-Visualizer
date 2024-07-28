import { coord, getNeighbors} from './grid.js';

class Node {
    constructor(position, parent = null) {
        this.position = position;
        this.parent = parent;
        this.g = 0; // Cost from start to current node
        this.h = 0; // Heuristic cost estimate to goal
        this.f = 0; // Total cost
    }
}

// Function to get neighbors (up, down, left, right)
function getNeighbors(node, grid) {
    const neighbors = [];
    const [x, y] = node;

    if (x > 0 && grid[x - 1][y] === 0) neighbors.push([x - 1, y]); // 
    if (x < grid.length - 1 && grid[x + 1][y] === 0) neighbors.push([x + 1, y]);
    if (y > 0 && grid[x][y - 1] === 0) neighbors.push([x, y - 1]);
    if (y < grid[0].length - 1 && grid[x][y + 1] === 0) neighbors.push([x, y + 1]);

    return neighbors;
}

function heuristic(a, b) {
    // Using Manhattan distance as the heuristic
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function aStar(grid, start, end) {
    const openList = [];
    const closedList = [];
    const startNode = new Node(start);
    const endNode = new Node(end);

    openList.push(startNode);

    while (openList.length > 0) {
        // Get the node with the lowest f value
        let currentNode = openList.reduce((prev, curr) => (prev.f < curr.f ? prev : curr));

        // Check if we reached the end
        if (currentNode.position[0] === endNode.position[0] && currentNode.position[1] === endNode.position[1]) {
            let path = [];
            let current = currentNode;
            while (current) {
                path.push(current.position);
                current = current.parent;
            }
            return path.reverse();
        }

        // Remove currentNode from openList and add to closedList
        openList.splice(openList.indexOf(currentNode), 1);
        closedList.push(currentNode);

        // Get neighbors
        const neighbors = getNeighbors(currentNode.position, grid);
        for (const neighborPosition of neighbors) {
            // Check if neighbor is in closedList
            if (closedList.find(node => node.position[0] === neighborPosition[0] && node.position[1] === neighborPosition[1])) {
                continue;
            }

            const g = currentNode.g + 1;
            let neighborNode = openList.find(node => node.position[0] === neighborPosition[0] && node.position[1] === neighborPosition[1]);

            if (!neighborNode) {
                neighborNode = new Node(neighborPosition, currentNode);
                neighborNode.g = g;
                neighborNode.h = heuristic(neighborPosition, endNode.position);
                neighborNode.f = neighborNode.g + neighborNode.h;
                openList.push(neighborNode);
            } else if (g < neighborNode.g) {
                neighborNode.g = g;
                neighborNode.f = neighborNode.g + neighborNode.h;
                neighborNode.parent = currentNode;
            }
        }
    }

    // No path found
    return [];
}

// Example usage
const start = [0, 0];
const end = [3, 2];
const path = aStar(coord, start, end);
console.log(path);