
export default class MinimaxSolver {



  constructor(game, depth) {
    this.game = game;
    this.depth = depth;

    this.AIEvalMatrix = aiMatrixGenerator(game.boardSize);
    this.personEvalMatrix = personEvalMatrix(game.boardSize);
  }

  



}

export function aiMatrixGenerator(size) {
  const matrix = [];

  const buffer = 5 * size;

  for (let i = 1; i <= size; i++) {
    const row = [];
    const baseNumber = (size - i) * 5;
    for (let j = 0; j < size; j++) {
      row.push(baseNumber + j*buffer);
    }
    matrix.push(row);
  }

  return matrix;
}


export function personEvalMatrix(size) {
  const matrix = [];

  const buffer = 5 * size;

  for (let i = 1; i <= size; i++) {
    const row = [];
    const baseNumber = (size - i) * buffer;
    for (let j = 0; j < size; j++) {
      row.push(-baseNumber - j * 5
        
      );
    }
    matrix.push(row);
  }

  return matrix;
}