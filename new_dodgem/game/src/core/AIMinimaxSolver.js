export class MinimaxSolver {
  constructor(gameSize, depth) {
    this.gameSize = gameSize;
    this.depth = depth;

    this.AIEvalMatrix = aiMatrixGenerator(gameSize);
    this.personEvalMatrix = personEvalMatrix(gameSize);
  }

  _currentValidMovesEvaled(game) {
    const moves = game.getCurrentValidMoves();
    moves.sort((a, b) => {
      const cloneA = game.getSameIdClone();
      cloneA.move(a.pieceId, a.move);
      const evalA = this.evaluate(cloneA);

      const cloneB = game.getSameIdClone();
      cloneB.move(b.pieceId, b.move);
      const evalB = this.evaluate(cloneB);

      return evalB - evalA;
    });

    return moves;
  }

  getBestMove(game) {
    let bestMove = null;
    let bestVal = -Infinity;

    const moves = this._currentValidMovesEvaled(game);

    let alpha = -Infinity;
    let beta = Infinity;
    moves.forEach((move) => {
      const clone = game.getSameIdClone();
      clone.move(move.pieceId, move.move);

      const val = this.minVal(clone, this.depth - 1, alpha, beta);

      if (val > bestVal) {
        bestVal = val;
        bestMove = move;
      }

      alpha = Math.max(alpha, bestVal);
    });

    if (!bestMove) {
      return null;
    }

    return bestMove;
  }

  maxVal(game, depth, alpha = -Infinity, beta = Infinity) {
    if (depth === 0 || game.isOver) {
      return this.evaluate(game);
    }

    let val = -Infinity;
    const moves = this._currentValidMovesEvaled(game);

    for (const move of moves) {
      const clone = game.getSameIdClone();
      clone.move(move.pieceId, move.move);
      val = Math.max(val, this.minVal(clone, depth - 1, alpha, beta));
      alpha = Math.max(alpha, val);

      if (alpha >= beta) {
        break;
      }
    }
    return val;
  }

  minVal(game, depth, alpha = -Infinity, beta = Infinity) {
    if (depth === 0 || game.isOver) {
      return this.evaluate(game);
    }

    let val = Infinity;

    const moves = this._currentValidMovesEvaled(game);

    for (const move of moves) {
      const clone = game.getSameIdClone();
      clone.move(move.pieceId, move.move);
      val = Math.min(val, this.maxVal(clone, depth - 1, alpha, beta));
      beta = Math.min(beta, val);

      if (alpha >= beta) {
        break;
      }
    }
    return val;
  }

  evaluate(game) {
    let score = 0;

    if (game.isOver) {
      if (game.winner === game.player2) {
        return Infinity;
      } else if (game.winner === game.player1) {
        return -Infinity;
      }
    }

    
    game.player2.pieces.forEach((piece) => {
      score += this.AIEvalMatrix[piece.position.x][piece.position.y];
    });
    
    game.player1.pieces.forEach((piece) => {
      score += this.personEvalMatrix[piece.position.x][piece.position.y];
    });
    
    const BLOCK_BONUS = (i) =>  5 * (this.gameSize - i) * (this.gameSize - 2); // so for 4x4 board (or 3x3 game), 5 * 4 * 2 = 40
    
    game.player1.pieces.forEach((personPiece) => {
      const { x: xP, y: yP } = personPiece.position;

      for (let i = 1; i <= game.gameSize - 1; i++) { 
        const playerBlockAi = { x: xP, y: yP - i };
        const aiBlockPlayer = { x: xP - i, y: yP };

        if (game._isInBoard(playerBlockAi.x, playerBlockAi.y )) {
          if (game.player2.pieces.find((piece) => { piece.position.x === playerBlockAi.x && piece.position.y === playerBlockAi.y; }) !== -1) {
            score -= BLOCK_BONUS(i - 1);
          }
        }

        if (game._isInBoard(aiBlockPlayer.x, aiBlockPlayer.y )) {
          if (game.player1.pieces.find((piece) => { piece.position.x === aiBlockPlayer.x && piece.position.y === aiBlockPlayer.y; }) !== -1) {
            score += BLOCK_BONUS(i - 1);
          }
        }
      }
    });
    return score;
  }
}

export function aiMatrixGenerator(size) {
  const matrix = Array(size)
    .fill(null)
    .map(() => Array(size).fill(5 * (size - 1) * size));
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
  const matrix = Array(size)
    .fill(null)
    .map(() => Array(size).fill(-5 * (size - 1) * size));
  const buffer = 5 * (size - 1);

  for (let i = 1; i < size; i++) {
    const baseNumber = (size - i - 1) * buffer;
    for (let j = 0; j < size - 1; j++) {
      matrix[i][j] = -baseNumber - j * 5;
    }
  }

  return matrix;
}

console.log(personEvalMatrix(4));
console.log(aiMatrixGenerator(4));

console.log(personEvalMatrix(5));
console.log(aiMatrixGenerator(5));


