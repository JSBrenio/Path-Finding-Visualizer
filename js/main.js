import { init, genRandMaze, clearGrid, debugMode, resetGrid } from './grid.js';
import { bfs, stop as bfs_stop, stats as bsfStats } from './bfs.js';
import { aStar, stop as aStar_stop, stats as aStats} from './a_star.js';
import { dijkstra, stop as dij_stop, stats as dijStats } from './dijkstra.js';

let selectedAlgorithm = 'aStar';

window.genRandMaze = genRandMaze;
window.clearGrid = clearGrid;
window.debugMode = debugMode;
window.start = start;
window.stop = stop;
window.selectAlgorithm = selectAlgorithm;
window.resetGrid = resetGrid;
window.save = save;
window.updateWallChanceDisplay = updateWallChanceDisplay;
window.saveImage = saveImage;

function updateWallChanceDisplay () {
    const slider = document.getElementById('wallChanceSlider');
    const display = document.getElementById('wallChanceDisplay');
    display.innerText = slider.value;
}


function start() {
    if (selectedAlgorithm === 'bfs') {
        bfs();
    } else if (selectedAlgorithm === 'aStar') {
        aStar();
    } else if (selectedAlgorithm === 'dijkstra') {
        dijkstra();
    }
}

function stop() {
    if (selectedAlgorithm === 'bfs') {
        bfs_stop();
        bsfStats.saveCurrentResults();
    } else if (selectedAlgorithm === 'aStar') {
        aStar_stop();
        aStats.saveCurrentResults();
    } else if (selectedAlgorithm === 'dijkstra') {
        dij_stop();
        dijStats.saveCurrentResults();
    }
}

function selectAlgorithm(algorithm) {
    selectedAlgorithm = algorithm;
    document.getElementById('bfsCheckbox').checked = (algorithm === 'bfs');
    document.getElementById('aStarCheckbox').checked = (algorithm === 'aStar');
    document.getElementById('dijkstraCheckbox').checked = (algorithm === 'dijkstra');

    // Show or hide the heuristic dropdown
    const heuristicSelection = document.getElementById('heuristic-selection');
    if (algorithm === 'aStar') {
        heuristicSelection.style.display = 'block';
    } else {
        heuristicSelection.style.display = 'none';
    }
}

function save() {
    if (selectedAlgorithm === 'bfs') {
        bsfStats.saveCurrentResults();
    } else if (selectedAlgorithm === 'aStar') {
        aStats.saveCurrentResults();
    } else if (selectedAlgorithm === 'dijkstra') {
        dijStats.saveCurrentResults();
    }
}

function saveImage() {
    const gridCanvas = document.getElementById('gridCanvas');
    const stats = document.getElementById('algorithm-stats');

    // Create a new canvas to combine the grid and statistics
    const combinedCanvas = document.createElement('canvas');
    const ctx = combinedCanvas.getContext('2d');

    // Set the new canvas size to fit both the grid and the statistics
    combinedCanvas.width = gridCanvas.width;
    combinedCanvas.height = gridCanvas.height + 200; // Adjust height to fit one line of text

    // Draw the grid
    ctx.drawImage(gridCanvas, 0, 0);
    const statsLines = stats.innerText.split('\n');
    const statsText = statsLines.slice(2, -2).join(' '); // Skip the first line and join the rest

    // Draw the statistics
    ctx.font = '28px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(statsText, 10, gridCanvas.height + 30);
    
    if (selectAlgorithm = 'aStar') {
        ctx.fillText('Algorithm: A*', 10, gridCanvas.height + 60);
        const heuristic = document.getElementById('heuristicDropdown').value;
        ctx.fillText(` Heuristic: ${heuristic}`, 175, gridCanvas.height + 60);
    } else {
        ctx.fillText(`Algorithm: ${selectedAlgorithm}`, 10, gridCanvas.height + 60);
    }

    ctx.fillText(`Diagonal Movement: ${document.getElementById('diagonalMovementCheckbox').checked ? 'Enabled' : 'Disabled'}`, 10, gridCanvas.height + 90);

    // Save as an image
    const link = document.createElement('a');
    link.href = combinedCanvas.toDataURL('image/png');
    link.download = `${selectedAlgorithm}.png`;
    link.click();
}

init();
selectAlgorithm(selectedAlgorithm);