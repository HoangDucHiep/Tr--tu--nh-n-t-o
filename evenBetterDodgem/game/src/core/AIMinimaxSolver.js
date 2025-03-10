import Game from "./Game.js"; 
import Player from "./Player.js";

import { GameMove } from "./Game.js";

export default class MinimaxSolver {
  constructor(boardSize, depth) {
    this.boardSize = boardSize;
    this.depth = depth;

    this.AIEvalMatrix = aiMatrixGenerator(boardSize);
    this.personEvalMatrix = personEvalMatrix(boardSize);
  }

  _currentValidMovesEvaled(game) {
    const moves = game.getCurrentValidMoves();
    moves.sort((a, b) => {
      const pieceA = game.currentPlayer.pieces.find(p => p.id === a.pieceId);
      const pieceB = game.currentPlayer.pieces.find(p => p.id === b.pieceId);
      const destA = this._getDestinationDistance(pieceA, game);
      const destB = this._getDestinationDistance(pieceB, game);
      return destA - destB;
    });
    return moves;
  }

  _getDestinationDistance(piece, game) {
    const dest = game.currentPlayer === game.player2 ? game.player2Des : game.player1Des;
    let minDistance = Infinity;
    for (const d of dest) {
      const distance = Math.abs(piece.x - d.x) + Math.abs(piece.y - d.y);
      if (distance < minDistance) minDistance = distance;
    }
    return minDistance;
  }

  getBestMove(game) {

    const start = Date.now();

    let bestMove = null;
    let bestVal = -Infinity;

    const moves = this._currentValidMovesEvaled(game);

    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of moves) {
      const state = game.saveState();
      game.move(move.pieceId, move.move);
      const val = this.minVal(game, this.depth - 1, alpha, beta);
      game.restoreState(state);

      if (val > bestVal) {
        bestVal = val;
        bestMove = move;
      }

      alpha = Math.max(alpha, bestVal);
    }

    console.log("Time taken: ", Date.now() - start);

    return bestMove;
  }

  maxVal(game, depth, alpha = -Infinity, beta = Infinity) {
    if (depth === 0 || game.isOver) {
      return this.evaluate(game);
    }

    let val = -Infinity;
    const moves = this._currentValidMovesEvaled(game);

    for (const move of moves) { 
      const state = game.saveState();
      game.move(move.pieceId, move.move);
      val = Math.max(val, this.minVal(game, depth - 1, alpha, beta));
      game.restoreState(state);
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
      const state = game.saveState();
      game.move(move.pieceId, move.move);
      val = Math.min(val, this.maxVal(game, depth - 1, alpha, beta));
      game.restoreState(state);
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
      score += this.AIEvalMatrix[piece.x][piece.y];
    });
    
    game.player1.pieces.forEach((piece) => {
      score += this.personEvalMatrix[piece.x][piece.y];
    });

    const BLOCK_BONUS = (i) => 5 * (this.boardSize - i) * (this.boardSize - 2); // so for 4x4 board (or 3x3 game), 5 * 4 * 2 = 40
    
    game.player1.pieces.forEach((personPiece) => {
      const xP = personPiece.x;
      const yP = personPiece.y;

      for (let i = 1; i <= game.boardSize - 1; i++) { 
        const playerBlockAi = { x: xP, y: yP - i };
        const aiBlockPlayer = { x: xP - i, y: yP };

        if (game._isInBoard(playerBlockAi.x, playerBlockAi.y)) {
          if (game.player2.pieces.find(piece => piece.x === playerBlockAi.x && piece.y === playerBlockAi.y) !== undefined) {
            score -= BLOCK_BONUS(i - 1);
          }
        }

        if (game._isInBoard(aiBlockPlayer.x, aiBlockPlayer.y )) {
          if (game.player1.pieces.find(piece => piece.x === aiBlockPlayer.x && piece.y === aiBlockPlayer.y) !== undefined) {
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
    .map(() => Array(size).fill(50 * size * (size - 1)));
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
    .map(() => Array(size).fill(-50 * size * (size - 1)));
  const buffer = 5 * (size - 1);

  for (let i = 1; i < size; i++) {
    const baseNumber = (size - i - 1) * buffer;
    for (let j = 0; j < size - 1; j++) {
      matrix[i][j] = -baseNumber - j * 5;
    }
  }

  return matrix;
}
/* 
const game = new Game(3, new Player("player1"), new Player("player2"));

const solver = new MinimaxSolver(4, 10);

game.move(game.player1.pieces[1].id, GameMove.Up);

game._displayBoard();
console.log("\n--------------------\n")

const bestMove = solver.getBestMove(game);
game.move(bestMove.pieceId, bestMove.move);
game._displayBoard();
console.log("\n--------------------\n")

game.move(game.player1.pieces[1].id, GameMove.Up);
game._displayBoard();
console.log("\n--------------------\n")

const bestMove2 = solver.getBestMove(game);
game.move(bestMove2.pieceId, bestMove2.move);
game._displayBoard();
console.log("\n--------------------\n") */