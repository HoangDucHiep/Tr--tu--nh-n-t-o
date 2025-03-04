import { PriorityQueue } from "./priority_queue.js"; 
export const SIZE = 3;

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

  // hill climbing algorithm
  // dfs search, find the best move at each step
    findSolution() {
      if (!this.isSolvable()) return null;
  
      const stack = [new PuzzleNode(this.initialState, this.startX, this.startY)];
      const visited = new Set();
      const goalKey = this.goalState.flat().join(",");
  
      while (stack.length > 0) {
        const current = stack.pop();
  
        if (current.stateKey === goalKey) {
          return this.buildSolutionPath(current);
        }
  
        visited.add(current.stateKey);
  
        // Object.keys(PuzzleNode.MOVES) returns ["UP", "DOWN", "LEFT", "RIGHT"] :)), the keys
        const pq = new PriorityQueue((a, b) => b.heuristic - a.heuristic)  // descendance cuz we will re push to a stack, to the order will be reversed
        Object.keys(PuzzleNode.MOVES).forEach((move) => {
          const nextNode = current.generateNextNode(move); // try every possible move, if it is valid and has not been visited
          if (nextNode && !visited.has(nextNode.stateKey)) {
            pq.push({ node: nextNode, heuristic: this.h2(nextNode.matrix, this.goalState) + this.h1(nextNode.matrix, this.goalState) }); // push the next node to the stack
          }
        });

        // push to stack
        while (!pq.isEmpty()) {
          stack.push(pq.pop().node)
        }
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

  // calculate h1 heuristic, the number of misplaced tiles
  // số ô không đúng vị trí
  h1(initial, goal) {
    let h = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (initial[i][j] !== goal[i][j]) {
          h++;
        }
      }
    }
    return h;
  }

  // calculate h2 heuristic, the sum of Manhattan distances
  // khoảng cách Manhattan giữa 2 ô trong 2 ma trận
  h2(initial, goal) {
    let h = 0;
    let map = {};
    // map the goal state to get the position of each number
    // lưu vị trí của mỗi số trong ma trận mục tiêu
    // ex: map[1] = {x: 0, y: 0}
    //    map[2] = {x: 0, y: 1}
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        map[goal[i][j]] = { x: i, y: j };
      }
    }

    // loop through the initial state and calculate the Manhattan distance
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (initial[i][j] !== goal[i][j]) {     // for each number that is not in the correct position  
          const { x, y } = map[initial[i][j]];
          h += Math.abs(x - i) + Math.abs(y - j);   // calculate the Manhattan distance, {(x - x') + (y - y')}
        }
      }
    }
    return h;
  }

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