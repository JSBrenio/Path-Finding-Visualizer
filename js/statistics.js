export class Statistics {
    constructor(algorithmName) {
        this.algorithmName = algorithmName;
        this.steps = 0;
        this.time = 0;
        this.pathLength = 0;
        this.visitedNodes = 0;
        this.updateDOM();
    }

    reset() {
        this.steps = 0;
        this.time = 0;
        this.pathLength = 0;
        this.visitedNodes = 0;
        document.getElementById('path-weight').innerText = 0;
        this.updateDOM();
    }

    step() {
        this.steps++;
    }

    startTimer() {
        this.startTime = Date.now();
    }

    stopTimer() {
        this.time = Date.now() - this.startTime;
    }

    path() {
        this.pathLength++;
    }

    visit() {
        this.visitedNodes++;
    }

    update(steps = this.steps, time = this.time, pathLength = this.pathLength, visitedNodes = this.visitedNodes) {
        this.steps = steps;
        this.time = time;
        this.pathLength = pathLength;
        this.visitedNodes = visitedNodes;
        this.updateDOM();
    }

    updateDOM() {
        document.getElementById('algorithm-name').innerText = this.algorithmName;
        document.getElementById('steps').innerText = this.steps;
        document.getElementById('time').innerText = this.time;
        document.getElementById('path-length').innerText = this.pathLength - 1;
        document.getElementById('nodes-visited').innerText = this.visitedNodes;
    }

    saveCurrentResults() {
        document.getElementById('prev-steps').innerText = document.getElementById('steps').innerText;
        document.getElementById('prev-time').innerText = document.getElementById('time').innerText;
        document.getElementById('prev-path-length').innerText = document.getElementById('path-length').innerText;
        document.getElementById('prev-nodes-visited').innerText = document.getElementById('nodes-visited').innerText;
        document.getElementById('prev-path-weight').innerText = document.getElementById('path-weight').innerText;
        document.getElementById('prev-algorithm-name').innerText = document.getElementById('algorithm-name').innerText;
    }
}