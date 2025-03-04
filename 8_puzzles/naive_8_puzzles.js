export const SIZE = 3;

// Comparison function for arrays
/* Array.prototype.matrixEquals = function (matrix) {
  return (
    this.length === matrix?.length && // Check if the arrays have the same length
    this.every(
      (row, i) =>
        row?.length === matrix[i]?.length && // length of each row must also be the same
        row.every((val, j) => val === matrix[i][j]) // check every element in the row
    ) // overall, it checks if every element in the array is the same
  );
};
 */
export class PuzzleNode {
  static MOVES = {
    // possible moves
    UP: { dx: 1, dy: 0 },
    DOWN: { dx: -1, dy: 0 },
    LEFT: { dx: 0, dy: 1 },
    RIGHT: { dx: 0, dy: -1 },
  };

  constructor(matrix, emptyX, emptyY, parent = null, move = null) {
    this.matrix = matrix.map((row) => [...row]); // Deep copy
    this.emptyX = emptyX;
    this.emptyY = emptyY;
    this.parent = parent;
    this.move = move;
  }

  generateNextNode(move) {
    // move is "UP", "DOWN", "LEFT" or "RIGHT"
    const { dx, dy } = PuzzleNode.MOVES[move]; // get the dx and dy values from the move
    const newX = this.emptyX + dx;
    const newY = this.emptyY + dy;

    if (!this.isValidPosition(newX, newY)) return null; // check if the new position is valid

    const newMatrix = this.matrix.map((row) => [...row]); // deep copy a new matrix
    // Swap positions, because only the empty tile can move
    [newMatrix[this.emptyX][this.emptyY], newMatrix[newX][newY]] = [
      newMatrix[newX][newY],
      newMatrix[this.emptyX][this.emptyY],
    ];

    return new PuzzleNode(newMatrix, newX, newY, this, move);
  }

  isValidPosition(x, y) {
    return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
  }

  get stateKey() {
    return this.matrix.flat().join(",");
  }
}

export class PuzzleSolver {
  constructor(initialState, goalState, emptyX, emptyY) {
    this.initialState = initialState;
    this.goalState = goalState;
    this.startX = emptyX;
    this.startY = emptyY;
  }

  // naive BFS
  findSolution() {
    if (!this.isSolvable()) return null;

    const queue = [new PuzzleNode(this.initialState, this.startX, this.startY)];
    const visited = new Set();
    const goalKey = this.goalState.flat().join(",");

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.stateKey === goalKey) {
        return this.buildSolutionPath(current);
      }

      visited.add(current.stateKey);

      // Object.keys(PuzzleNode.MOVES) returns ["UP", "DOWN", "LEFT", "RIGHT"] :)), the keys
      Object.keys(PuzzleNode.MOVES).forEach((move) => {
        const nextNode = current.generateNextNode(move); // try every possible move, if it is valid and has not been visited
        if (nextNode && !visited.has(nextNode.stateKey)) {
          queue.push(nextNode); // push the next node to the queue
        }
      });
    }

    return null; // no solution found
  }

  buildSolutionPath(endNode) {
    const path = [];
    let current = endNode;

    while (current) {
      path.unshift(current);
      current = current.parent;
    }

    return path;
  }

  // the puzzle is solvable if the number of inversions
  // is the same odd or even number of inversions in the goal state
  isSolvable() {
    const inversionParity = this.calculateInversionParity(this.initialState);
    const goalParity = this.calculateInversionParity(this.goalState);
    return inversionParity === goalParity;
  }

  // calculate the number of inversions in the matrix
  // "Inversion là các cặp số (a, b) mà a đứng trước b trong mảng, nhưng a > b"
  //  inversion % 2 để chỉ lấy tính chẵn lẻ
  calculateInversionParity(matrix) {
    let arr = matrix.flat();
    let inversions = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }

    return inversions % 2;
  }

  // calculate 
}

// Usage example
const initial = [
  [1, 2, 3],
  [4, 0, 6],
  [7, 5, 8],
];

const goal = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

const solver = new PuzzleSolver(initial, goal, 1, 1);
const solution = solver.findSolution();

if (solution) {
  console.log(`Solution found in ${solution.length - 1} moves:`);
  solution.forEach((node, index) => {
    if (index > 0) console.log(`Move ${index}: ${node.move}`);
  });
} else {
  console.log("No solution found");
}