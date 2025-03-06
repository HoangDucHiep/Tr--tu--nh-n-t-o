export class MinimaxSolver {
  constructor(gameSize, depth) {
    this.gameSize = gameSize;
    this.depth = depth;

    this.AIEvalMatrix = aiMatrixGenerator(gameSize);
    this.personEvalMatrix = personEvalMatrix(gameSize);
  }

  getBestMove(game) {
    let bestMove = null;
    let bestVal = -Infinity;

    const moves = game.getCurrentValidMoves();

    moves.forEach((move) => {
      const clone = game.getSameIdClone();
      clone.move(move.pieceId, move.move);

      const val = this.minVal(clone, this.depth - 1);

      if (val > bestVal) {
        bestVal = val;
        bestMove = move;
      }
    });

    return bestMove;
  }

  maxVal(game, depth) {
    if (depth === 0 || game.isOver) {
      return this.evaluate(game);
    }

    let val = -Infinity;

    const moves = game.getCurrentValidMoves();

    moves.forEach((move) => {
      const clone = game.getSameIdClone();
      clone.move(move.pieceId, move.move);
      val = Math.max(val, this.minVal(clone, depth - 1));
    });

    return val;
  }

  minVal(game, depth) {
    if (depth === 0 || game.isOver) {
      return this.evaluate(game);
    }

    let val = Infinity;

    const moves = game.getCurrentValidMoves();

    moves.forEach((move) => {
      const clone = game.getSameIdClone();
      clone.move(move.pieceId, move.move);
      val = Math.min(val, this.maxVal(clone, depth - 1));
    });

    return val;
  }

  evaluate(game) {
    let score = 0;

    const BLOCK_BONUS = 15 * this.gameSize;
    const INDIRECT_BLOCK_BONUS = 10 * this.gameSize;

    game.player2.pieces.forEach((piece) => {
      score += this.AIEvalMatrix[piece.position.x][piece.position.y];
    });

    game.player1.pieces.forEach((piece) => {
      score += this.personEvalMatrix[piece.position.x][piece.position.y];
    });

    game.player1.pieces.forEach((personPiece) => {
      const { x: xP, y: yP } = personPiece.position;

      const playerBlockAi = { x: xP, y: yP - 1 };
      const playerIndirectBlockAi = { x: xP, y: yP - 2 };

      const AiBlockPlayer = { x: xP - 1, y: yP };
      const AiIndirectBlockPlayer = { x: xP - 2, y: yP };

      if (game._isInBoard({ x: playerBlockAi.x, y: playerBlockAi.y })) {
        game.player2.pieces.find((piece) => {
          if (piece.position.x === playerBlockAi.x && piece.position.y === playerBlockAi.y) {
            score -= BLOCK_BONUS;
          }
        });
      }

      if (game._isInBoard({ x: playerIndirectBlockAi.x, y: playerIndirectBlockAi.y })) {
        game.player2.pieces.find((piece) => {
          if (piece.position.x === playerIndirectBlockAi.x && piece.position.y === playerIndirectBlockAi.y) {
            score -= INDIRECT_BLOCK_BONUS;
          }
        });
      }

      if (game._isInBoard({ x: AiBlockPlayer.x, y: AiBlockPlayer.y })) {
        game.player1.pieces.find((piece) => {
          if (piece.position.x === AiBlockPlayer.x && piece.position.y === AiBlockPlayer.y) {
            score += BLOCK_BONUS;
          }
        });
      }

      if (game._isInBoard({ x: AiIndirectBlockPlayer.x, y: AiIndirectBlockPlayer.y })) {
        game.player1.pieces.find((piece) => {
          if (piece.position.x === AiIndirectBlockPlayer.x && piece.position.y === AiIndirectBlockPlayer.y) {
            score += INDIRECT_BLOCK_BONUS;
          }
        });
      }
    });

    return score;
  }
}

export function aiMatrixGenerator(size) {
  const matrix = Array(size).fill(null).map(() => Array(size).fill(5 * (size - 1) * size));
  const buffer = 5 * (size - 1);

  for (let i = 1; i < size; i++) {
    const baseNumber = (size - i - 1) * 5;
    for (let j = 0; j < size - 1; j++) {
      matrix[i][j] = baseNumber + j * buffer;
    }
  }
  return matrix;
}

export function personEvalMatrix(size) {
  const matrix = Array(size).fill(null).map(() => Array(size).fill(-5 * (size - 1) * size));
  const buffer = 5 * (size - 1);

  for (let i = 1; i < size; i++) {
    const baseNumber = (size - i - 1) * buffer;
    for (let j = 0; j < size - 1; j++) {
      matrix[i][j] = -baseNumber -j * 5;
    }
  }

  return matrix;
}

console.log(personEvalMatrix(4));
console.log(aiMatrixGenerator(4));


console.log(personEvalMatrix(5));
console.log(aiMatrixGenerator(5));