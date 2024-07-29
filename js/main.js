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

init();
selectAlgorithm(selectedAlgorithm);