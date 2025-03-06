import { PLAYER1, PLAYER2 } from "./Game";
import Game from "./Game";
export default class MinimaxSolver {
  constructor(game, depth) {
    this.game = game;
    this.depth = depth;

    this.AIEvalMatrix = aiMatrixGenerator(game.boardSize);
    this.personEvalMatrix = personEvalMatrix(game.boardSize);

    this.AI_POSSIBLE_MOVES = [
      { piece: game.players[PLAYER2].pieces[0], move: Game.AI_MOVES[0] },
      { piece: game.players[PLAYER2].pieces[0], move: Game.AI_MOVES[1] },
      { piece: game.players[PLAYER2].pieces[0], move: Game.AI_MOVES[2] },
      
      { piece: game.players[PLAYER2].pieces[1], move: Game.AI_MOVES[0] },
      { piece: game.players[PLAYER2].pieces[1], move: Game.AI_MOVES[1] },
      { piece: game.players[PLAYER2].pieces[1], move: Game.AI_MOVES[2] },
    ];

    this.PERSON_POSSIBLE_MOVES = [
      { piece: game.players[PLAYER1].pieces[0], move: Game.PLAYER_MOVES[0] },
      { piece: game.players[PLAYER1].pieces[0], move: Game.PLAYER_MOVES[1] },
      { piece: game.players[PLAYER1].pieces[0], move: Game.PLAYER_MOVES[2] },
      
      { piece: game.players[PLAYER1].pieces[1], move: Game.PLAYER_MOVES[0] },
      { piece: game.players[PLAYER1].pieces[1], move: Game.PLAYER_MOVES[1] },
      { piece: game.players[PLAYER1].pieces[1], move: Game.PLAYER_MOVES[2] },
    ];
  }

  getBestMove() {
    let bestMove = null;
    let bestVal = -Infinity;
    
    this.AI_POSSIBLE_MOVES.forEach((move) => {
      const newGame = this.game.sameIdClone();
      newGame.playTurn(move.piece.id, { x: move.piece.position.x + move.move.x, y: move.piece.position.y + move.move.y });
      const val = this.minVal(newGame, this.depth - 1);
      if (val > bestVal) {
        bestVal = val;
        bestMove = move;
      }
    });
    return { pieceId: bestMove.piece.id, move: { x: bestMove.piece.position.x + bestMove.move.x, y: bestMove.piece.position.y + bestMove.move.y } };
  }
  
  maxVal(game, depth) {
    if (depth === 0 || game.isOver) {
      return this.evaluate(game);
    }
    
    let max = -Infinity;
    
    
    this.PERSON_POSSIBLE_MOVES.forEach((move) => {
      const newGame = game.sameIdClone();
      newGame.playTurn(move.piece.id, { x: move.piece.position.x + move.move.x, y: move.piece.position.y + move.move.y });
      const val = this.minVal(newGame, depth - 1);
      max = Math.max(max, val);
    });
    
    return max;
  }


  minVal(game, depth) {
    if (depth === 0 || game.isOver) {
      return this.evaluate(game);
    }

    let min = Infinity;

    this.AI_POSSIBLE_MOVES.forEach((move) => {
      const newGame = game.sameIdClone();
      newGame.playTurn(move.piece.id, { x: move.piece.position.x + move.move.x, y: move.piece.position.y + move.move.y });
      const val = this.maxVal(newGame, depth - 1);
      min = Math.min(min, val);
    });
    return min;
  }


  evaluate(game) {
    let score = 0;

    const person = game.players[PLAYER1];
    const AI = game.players[PLAYER2];

    person.pieces.forEach((piece) => {
      score += this.personEvalMatrix[piece.position.x][piece.position.y];
    });

    score -= game.boardSize * 25 * (2 - person.pieces.length); 

    AI.pieces.forEach((piece) => {
      score += this.AIEvalMatrix[piece.position.x][piece.position.y];
    });

    score += game.boardSize * 25 * (2 - AI.pieces.length);

    person.pieces.forEach((piece) => { 
      if (piece.position.y - 1 >= 0) {
        if (AI.pieces.some(
          p => p.position.x === piece.position.x
            && p.position.y === piece.position.y - 1)
        ) {
          score -= 40;
        }
      }

      if (piece.position.y - 2 >= 0) {
        if (AI.pieces.some(
          p => p.position.x === piece.position.x
            && p.position.y === piece.position.y - 2)
        ) {
          score -= 30;
        }
      }
    });

    AI.pieces.forEach((piece) => {
      if (piece.position.x + 1 < game.boardSize) {
        if (person.pieces.some(
          p => p.position.x === piece.position.x + 1
            && p.position.y === piece.position.y)
        ) {
          score += 40;
        }
      }

      if (piece.position.x + 2 < game.boardSize) {
        if (person.pieces.some(
          p => p.position.x === piece.position.x + 2
            && p.position.y === piece.position.y)
        ) {
          score += 30;
        }
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