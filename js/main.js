import {init, genRandMaze, clearGrid, debugMode } from './grid.js';
import {bfs, stop} from './bfs.js';

window.genRandMaze = genRandMaze;
window.clearGrid = clearGrid;
window.debugMode = debugMode;
window.start = bfs;
window.stop = stop;

init();
