import { genRandMaze } from './grid.js';
import { aStar, stats as aStats} from './a_star.js';
import { dijkstra, stats as dijStats } from './dijkstra.js';
import { saveImage } from './main.js';

export async function collectData(trials = document.getElementById('trials').value) {
    console.clear();
    document.getElementById('diagonalMovementCheckbox').checked = true;
    document.getElementById('sleep').checked = true;
    let manhattan = [];
    let euclidean = [];
    let chebyshev = [];
    let octile = [];
    let dijkstraStats = [];
    for (let i = 0; i < trials; i++) {
        document.getElementById('aStarCheckbox').click();
        genRandMaze();
        document.getElementById('heuristicDropdown').value = 'manhattan';
        aStar();
        aStats.update();
        saveImage(i);
        manhattan.push({'steps': aStats.steps, 'ms': aStats.time, 'length': aStats.pathLength, 'nodes': aStats.visitedNodes});

        await sleep(1000);

        document.getElementById('heuristicDropdown').value = 'euclidean';
        aStar();
        aStats.update();
        saveImage(i);
        euclidean.push({'steps': aStats.steps, 'ms': aStats.time, 'length': aStats.pathLength, 'nodes': aStats.visitedNodes});

        await sleep(1000);

        document.getElementById('heuristicDropdown').value = 'chebyshev';
        aStar();
        aStats.update();
        saveImage(i);
        chebyshev.push({'steps': aStats.steps, 'ms': aStats.time, 'length': aStats.pathLength, 'nodes': aStats.visitedNodes});

        await sleep(1000);

        document.getElementById('heuristicDropdown').value = 'octile';
        aStar();
        aStats.update();
        saveImage(i);
        octile.push({'steps': aStats.steps, 'ms': aStats.time, 'length': aStats.pathLength, 'nodes': aStats.visitedNodes});

        await sleep(1000);

        document.getElementById('dijkstraCheckbox').click();
        dijkstra();
        dijStats.update();
        saveImage(i);
        dijkstraStats.push({'steps': dijStats.steps, 'ms': dijStats.time, 'length': dijStats.pathLength, 'nodes': dijStats.visitedNodes});

        await sleep(1000); // Sleep for 1 second
        // Function to sleep for a given number of milliseconds
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    console.log("Manhattan Heuristic:");
    printPretty(manhattan);
    console.log("Euclidean Heuristic:");
    printPretty(euclidean);
    console.log("Chebyshev Heuristic:");
    printPretty(chebyshev);
    console.log("Octile Heuristic:");
    printPretty(octile);
    console.log("Dijkstra Stats:");
    printPretty(dijkstraStats);

    let data = { 'manhattan': manhattan, 'euclidean': euclidean, 'chebyshev': chebyshev, 'octile': octile, 'dijkstra': dijkstraStats };
    downloadJson(data, 'data.json');
}

function printPretty(data) {
    console.log(JSON.stringify(data, null, 0));
}


function downloadJson(data, filename) {
    // Step 1: Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Step 2: Create a Blob with JSON content
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Step 3: Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Step 4: Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download.json';
    document.body.appendChild(a); // Append the anchor to document
    a.click(); // Trigger a click on the element
    document.body.removeChild(a); // Clean up
    
    // Optional: Revoke the blob URL to free up resources
    URL.revokeObjectURL(url);
}