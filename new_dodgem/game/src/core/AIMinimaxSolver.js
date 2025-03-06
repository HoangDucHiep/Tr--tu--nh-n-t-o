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

    game.player2.pieces.forEach((piece) => {
      score += this.AIEvalMatrix[piece.position.x][piece.position.y];
    });

    game.player1.pieces.forEach((piece) => {
      score += this.personEvalMatrix[piece.position.x][piece.position.y];
    });

    game.player1.pieces.forEach((personPiece) => {
      const { x: xP, y: yP } = personPiece.position;

      const playerBlockAi = { x: xP, y: yP - 1 };
      const playerRelativeBlockAi = { x: xP, y: yP - 2 };

      const AiBlockPlayer = { x: xP - 1, y: yP };
      const AiRelativeBlockPlayer = { x: xP - 2, y: yP };

      if (game._isInBoard({ x: playerBlockAi.x, y: playerBlockAi.y })) {
        game.player2.pieces.find((piece) => {
          if (piece.position.x === playerBlockAi.x && piece.position.y === playerBlockAi.y) {
            score -= 40;
          }
        });
      }

      if (game._isInBoard({ x: playerRelativeBlockAi.x, y: playerRelativeBlockAi.y })) {
        game.player2.pieces.find((piece) => {
          if (piece.position.x === playerRelativeBlockAi.x && piece.position.y === playerRelativeBlockAi.y) {
            score -= 30;
          }
        });
      }

      if (game._isInBoard({ x: AiBlockPlayer.x, y: AiBlockPlayer.y })) {
        game.player1.pieces.find((piece) => {
          if (piece.position.x === AiBlockPlayer.x && piece.position.y === AiBlockPlayer.y) {
            score += 40;
          }
        });
      }

      if (game._isInBoard({ x: AiRelativeBlockPlayer.x, y: AiRelativeBlockPlayer.y })) {
        game.player1.pieces.find((piece) => {
          if (piece.position.x === AiRelativeBlockPlayer.x && piece.position.y === AiRelativeBlockPlayer.y) {
            score += 30;
          }
        });
      }
    });

    return score;
  }
}

export function aiMatrixGenerator(size) {
  const matrix = [];

  const buffer = 5 * size;

  for (let i = 1; i <= size; i++) {
    const row = [];
    const baseNumber = (size - i) * 5;
    for (let j = 0; j < size; j++) {
      row.push(baseNumber + j * buffer);
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
      row.push(-baseNumber - j * 5);
    }
    matrix.push(row);
  }

  return matrix;
}
