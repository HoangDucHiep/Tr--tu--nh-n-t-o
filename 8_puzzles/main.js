const SIZE = 3;
//2 dimensions array comparison
Array.prototype.equals = function (multiArray) {
    if (!multiArray) {
        return false;
    }

    if (multiArray === this) {
        return true;
    }

    if (this.length !== multiArray.length) {
        return false;
    }

    for (let i = 0; i < this.length; i++) {
        if (this[i].length !== multiArray[i].length) {
            return false;
        }

        for (let j = 0; j < this[i].length; j++) {
            if (this[i][j] !== multiArray[i][j]) {
                return false;
            }
        }
    }

    return true;
}

class Node {
    static UP = "UP";
    static DOWN = "DOWN";
    static LEFT = "LEFT";
    static RIGHT = "RIGHT";

    constructor(matrix, emptyX, emptyY, parent, move) { 
        this.matrix = matrix;
        this.emptyX = emptyX;
        this.emptyY = emptyY;
        this.parent = parent;
        this.move = move;
    }

    doMove(move) { 
        let newMatrix = this.matrix.map(row => row.slice()); //get shallow copy of matrix
        let newEmptyX, newEmptyY;

        switch (move) {
            case Node.UP:
                newEmptyX = this.emptyX + 1;
                newEmptyY = this.emptyY;
                break;
            case Node.DOWN:
                newEmptyX = this.emptyX - 1;
                newEmptyY = this.emptyY;
                break;
            case Node.LEFT:
                newEmptyX = this.emptyX;
                newEmptyY = this.emptyY + 1;
                break;
            case Node.RIGHT:
                newEmptyX = this.emptyX;
                newEmptyY = this.emptyY - 1;
                break;
        }

        if (!this.#isSafe(newEmptyX, newEmptyY)) { 
            return null;
        }

        newMatrix[this.emptyX][this.emptyY] = newMatrix[newEmptyX][newEmptyY];
        newMatrix[newEmptyX][newEmptyY] = 0;

        return new Node(newMatrix, newEmptyX, newEmptyY, this, move);
    }


    #isSafe(x, y) {
        return x >= 0 && x < this.matrix.length && y >= 0 && y < this.matrix.length;
    }

    toString() { 
        return this.matrix.map(row => row.join(" ")).join("\n");
    }
}

class Solver {
    constructor(startMatrix, emptyX, emptyY, finalMatrix) {
        this.startMatrix = startMatrix;
        this.emptyX = emptyX;
        this.emptyY = emptyY;
        this.finalMatrix = finalMatrix;
    }

    getSolution() { 
        let result = this.#solve();

        if (!result) { 
            return null;
        }

        let moves = [];

        while (result) {
            moves.push(result);
            result = result.parent;
        }

        return moves.reverse();
    }

    #solve() {
        if (!this.#isSolvable(this.startMatrix, this.finalMatrix)) {
            console.log("Unsolvable puzzle");
            return null;
        }

        const qp = []; //queue for dfs
        const visited = new Set(); //visited nodes

        const start = new Node(this.startMatrix, this.emptyX, this.emptyY, null, null);

        qp.push(start);

        while (qp.length > 0) {
            const cur = qp.shift();

            if (cur.matrix.equals(this.finalMatrix)) {
                return cur;
            }

            visited.add(cur.matrix);

            const up = cur.doMove(Node.UP);
            const down = cur.doMove(Node.DOWN);
            const left = cur.doMove(Node.LEFT);
            const right = cur.doMove(Node.RIGHT);

            if (up && !visited.has(up.matrix)) {
                qp.push(up);
            }

            if (down && !visited.has(down.matrix)) {
                qp.push(down);
            }

            if (left && !visited.has(left.matrix)) {
                qp.push(left);
            }

            if (right && !visited.has(right.matrix)) {
                qp.push(right);
            }
        }
    }

    
    #isSolvable(start, final) {
        let invCountStart = this.#getInvCount(start);
        let invCountFinal = this.#getInvCount(final);

        return invCountStart % 2 === invCountFinal % 2;
    }

    #getInvCount(matrix) {
        let arr = matrix.flat();
        let invCount = 0;
    
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] && arr[j] && arr[i] > arr[j]) {
                    invCount++;
                }
            }
        }
    
        return invCount;
    }
}

let currentSolution = [];
let currentStep = 0;

function getMatrixFromInputs(prefix) {
    let matrix = [];
    for (let i = 0; i < SIZE; i++) {
        let row = [];
        for (let j = 0; j < SIZE; j++) {
            const value = parseInt(document.getElementById(`${prefix}-${i}-${j}`).value);
            row.push(value ? value : 0);
            if (value === 0) {
                window[`${prefix}EmptyX`] = i;
                window[`${prefix}EmptyY`] = j;
            }
        }
        matrix.push(row);
    }
    return matrix;
}

function displayMatrix(matrix) {
    const resultMatrix = document.querySelector('.result .matrix');
    resultMatrix.innerHTML = '';
    
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            cell.textContent = matrix[i][j] || '';
            resultMatrix.appendChild(cell);
        }
    }
}

function updateStepCounter() {
    const [current, total] = document.querySelector('.step-counter').getElementsByTagName('span');
    current.textContent = currentStep + 1;
    total.textContent = currentSolution.length;
}

document.getElementById('solve').addEventListener('click', () => {
    const startMatrix = getMatrixFromInputs('m1');
    const finalMatrix = getMatrixFromInputs('m2');

    console.log(startMatrix, finalMatrix);

    const solver = new Solver(startMatrix, m1EmptyX, m1EmptyY, finalMatrix);
    currentSolution = solver.getSolution();
    currentStep = 0;

    
    if (currentSolution) {
        displayMatrix(currentSolution[currentStep].matrix);
        document.querySelector('.result').style.display = 'flex';
        updateStepCounter();
    } else {
        alert('No solution found!');
    }
});

document.querySelector('.result button:first-child').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        displayMatrix(currentSolution[currentStep].matrix);
        updateStepCounter();
    }
});

document.querySelector('.result button:last-child').addEventListener('click', () => {
    if (currentStep < currentSolution.length - 1) {
        currentStep++;
        displayMatrix(currentSolution[currentStep].matrix);
        updateStepCounter();
    }
});

// reset button
function resetAll() {
    // Clear all input fields
    const inputs = document.querySelectorAll('.matrix input');
    inputs.forEach(input => input.value = '');

    // Hide result section
    document.querySelector('.result').style.display = 'none';

    // Clear result matrix
    document.querySelector('.result .matrix').innerHTML = '';

    // Reset step counter
    const [current, total] = document.querySelector('.step-counter').getElementsByTagName('span');
    current.textContent = '0';
    total.textContent = '0';

    // Reset solution tracking
    currentSolution = [];
    currentStep = 0;
}
document.getElementById('reset').addEventListener('click', resetAll);

// randomize button
function randomize() {
    const inputs = document.querySelectorAll('.start-matrix input');
    const values = Array.from({ length: SIZE * SIZE }, (_, i) => i);
    const shuffled = values.sort(() => Math.random() - 0.5);

    inputs.forEach((input, i) => {
        input.value = shuffled[i];
    });
}

document.getElementById('random').addEventListener('click', randomize);

// shuffle button
function shuffle(matrix) {
    let emptyX, emptyY;
    let newMatrix = matrix.map(row => row.slice());

    // random shuffle times from 10 to 50
    let shuffleTimes = Math.floor(Math.random() * 40) + 10;

    for (let i = 0; i < 20; i++) {
        const moves = [Node.UP, Node.DOWN, Node.LEFT, Node.RIGHT];
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const emptyIndex = newMatrix.flat().indexOf(0);
        emptyX = Math.floor(emptyIndex / SIZE);
        emptyY = emptyIndex % SIZE;

        const node = new Node(newMatrix, emptyX, emptyY, null, null);
        const nextNode = node.doMove(randomMove);

        if (nextNode) {
            newMatrix = nextNode.matrix;
        }
    }

    return newMatrix;
}

document.getElementById('shuffle').addEventListener('click', () => {
    const startMatrix = getMatrixFromInputs('m1');
    const shuffledMatrix = shuffle(startMatrix);

    shuffledMatrix.forEach((row, i) => {
        row.forEach((value, j) => {
            document.getElementById(`m2-${i}-${j}`).value = value;
        });
    });
});