import { PuzzleNode, PuzzleSolver, SIZE } from './hill_climbing_8_puzzles.js';

// UI
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

  // Sửa lại thứ tự tham số
  const puzzleSolver = new PuzzleSolver(
      startMatrix, 
      finalMatrix,   // goalState
      m1EmptyX,      // emptyX của trạng thái ban đầu
      m1EmptyY       // emptyY của trạng thái ban đầu
  );

  currentSolution = puzzleSolver.findSolution();
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

    for (let i = 0; i < shuffleTimes; i++) {
        const moves = Object.keys(PuzzleNode.MOVES);
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const emptyIndex = newMatrix.flat().indexOf(0);
        emptyX = Math.floor(emptyIndex / SIZE);
        emptyY = emptyIndex % SIZE;

        const puzzleNode = new PuzzleNode(newMatrix, emptyX, emptyY, null, null);
        const nextPuzzleNode = puzzleNode.generateNextNode(randomMove);

        if (nextPuzzleNode) {
            newMatrix = nextPuzzleNode.matrix;
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