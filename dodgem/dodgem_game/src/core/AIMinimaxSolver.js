
class MinimaxSolver {

  constructor(game, depth) {
    this.game = game;
    this.depth = depth;

    this.AIEvalMatrix = [
      [10, 25, 40],
      [5, 20, 35],
      [0, 15, 30]
    ]
  }


  aiMatrixGenerator(size) {
    const matrix = [];

    const buffer = 3 * size;

    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(buffer - (i + j));
      }
      matrix.push(row);
    }

    return matrix;
  }
}

aiMatrixGenerator(size) {
  const matrix = [];

  const buffer = 3 * size;

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(buffer - (i + j));
    }
    matrix.push(row);
  }

  return matrix;
}

console.log(aiMatrixGenerator(3));