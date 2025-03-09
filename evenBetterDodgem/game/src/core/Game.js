import Piece from "./Piece.js";
import Player from "./Player.js";
import MinimaxSolver from "./AIMinimaxSolver.js";

export class GameMove {
  static Up = { x: -1, y: 0 };
  static Down = { x: 1, y: 0 };
  static Left = { x: 0, y: -1 };
  static Right = { x: 0, y: 1 };

  static All = [GameMove.Up, GameMove.Down, GameMove.Left, GameMove.Right];
}

const PLAYER1_COLOR = "red";
const PLAYER2_COLOR = "blue";

export default class Game {
  constructor(size, player1, player2, skipInit = false) {
    this.id = `game-${Date.now()}`;
    this.gameSize = size;
    this.boardSize = size + 1;

    this.board = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }, () => null)
    );

    this.player1 = player1;
    this.player2 = player2;

    if (!skipInit) {
      this._initializeBoard();
    }

    if (player2.isAI) {
      this.AISolver = new MinimaxSolver(this.boardSize, this.gameSize === 3 ? 10 : this.gameSize === 4 ? 12 : 15);
    }

    this.currentPlayer = player1;
    this.winner = null;
    this.isOver = false;
  }

  _initializeBoard() {
    for (let i = 1; i < this.gameSize; i++) {
      const p1_piece = new Piece(PLAYER1_COLOR, this.player1.id, this.gameSize, i);
      const p2_piece = new Piece(PLAYER2_COLOR, this.player2.id, i, 0);

      this.board[this.gameSize][i] = p1_piece;
      this.board[i][0] = p2_piece;

      this.player1.pieces.push(p1_piece);
      this.player2.pieces.push(p2_piece);
    }

    this.player1Des = Array.from({ length: this.gameSize }, (_, i) => ({
      x: 0,
      y: i,
    }));

    this.player2Des = Array.from({ length: this.gameSize }, (_, i) => ({
      x: i + 1,
      y: this.gameSize,
    }));
  }

  move(pieceId, move) {
    if (this.isOver) {
      //console.log("Game is over");
      return;
    }

    if (!this.validateMove(pieceId, move)) {
      return false;
    }

    const piece = this.currentPlayer.pieces.find((p) => p.id === pieceId);

    const newX = piece.x + move.x;
    const newY = piece.y + move.y;

    this.put(pieceId, newX, newY);
  }

  put(pieceId, newX, newY) {
    if (this.isOver) {
      //console.log("Game is over");
      return;
    }

    if (!this.validateNewTile(pieceId, newX, newY)) {
      return false;
    }

    if (this._isDestinationTile(newX, newY, this.currentPlayer)) {
      // find a empty destination in the board (the tile that is null) to put

      const des =
        this.currentPlayer === this.player1 ? this.player1Des : this.player2Des;

      const emptyDes = des.find((d) => this.board[d.x][d.y] === null);

      if (!emptyDes) {
        //console.log("No empty destination");
        return false;
      }

      ({ x: newX, y: newY } = emptyDes);
    }

    const piece = this.currentPlayer.pieces.find((p) => p.id === pieceId);

    this.board[piece.x][piece.y] = null;
    this.board[newX][newY] = piece;
    piece.x = newX;
    piece.y = newY;

    if (this._isDestinationTile(newX, newY, this.currentPlayer)) {
      piece.reachedDestination = true;
    }

    if (this.currentPlayer.pieces.every((p) => p.reachedDestination)) {
      this.isOver = true;
      this.winner = this.currentPlayer;
    }

    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;

    if (this.getCurrentValidMoves().length === 0) {
      this.isOver = true;
      this.winner =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    //this._displayBoard();
  }

  AIMove() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const move = this.AISolver.getBestMove(this);

        if (move === null) {
          this.isOver = true;
          this.winner = this.currentPlayer === this.player1 ? this.player2 : this.player1;
          resolve();
          return;
        }

        this.move(move.pieceId, move.move);
        this._displayBoard();
        resolve();
      }, 10);
    });
  }

  validateMove(pieceId, move) {
    const piece = this.currentPlayer.pieces.find((p) => p.id === pieceId);
    if (!piece) {
      return false;
    }

    const newX = piece.x + move.x;
    const newY = piece.y + move.y;

    return this.validateNewTile(pieceId, newX, newY);
  }

  validateNewTile(pieceId, newX, newY) {
    const piece = this.currentPlayer.pieces.find((p) => p.id === pieceId);
    if (!piece) {
      //console.log("Invalid piece");
      return false;
    }

    if (
      !this._isCurrentPLayerMove({
        x: newX - piece.x,
        y: newY - piece.y,
      })
    ) {
      //console.log("Invalid move");
      return false;
    }

    if (this._isPieceReachDestination(piece)) {
      //console.log("Piece already reached destination");
      return false;
    }

    if (!this._isInBoard(newX, newY)) {
      //console.log("Out of board");
      return false;
    }

    if (
      !this._isEmptyTile(newX, newY) &&
      !this._isDestinationTile(newX, newY, this.currentPlayer)
    ) {
      //console.log("Destination is not empty");
      return false;
    }

    if (!this._isOneStepMove(piece.x, piece.y, newX, newY)) {
      //console.log("Invalid move");
      return false;
    }

    // can't move to opponent's destination
    if (
      this._isDestinationTile(
        newX,
        newY,
        this.currentPlayer === this.player1 ? this.player2 : this.player1
      )
    ) {
      //console.log("Can't move to opponent's destination");
      return false;
    }

    return true;
  }

  getCurrentValidMoves() {
    const moves = this._getPlayerMoves(this.currentPlayer);
    const validMoves = [];

    for (const piece of this.currentPlayer.pieces) {
      for (const move of moves) {
        if (this.validateMove(piece.id, move)) {
          validMoves.push({ pieceId: piece.id, move });
        }
      }
    }
    return validMoves;
  }

  // validate methods
  _isInBoard(x, y) {
    return x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize;
  }

  _isEmptyTile(x, y) {
    return this.board[x][y] === null;
  }

  _isDestinationTile(x, y, player) {
    return (
      (player === this.player1 &&
        this.player1Des.some((p) => p.x === x && p.y === y)) ||
      (player === this.player2 &&
        this.player2Des.some((p) => p.x === x && p.y === y))
    );
  }

  _isOneStepMove(x, y, newX, newY) {
    return (
      Math.abs(x - newX) <= 1 &&
      Math.abs(y - newY) <= 1 &&
      (x - newX) * (y - newY) === 0 // can't move cross
    ); 
  }

  _isCurrentPLayerMove(move) {
    return this._getPlayerMoves(this.currentPlayer).some(
      (m) => m.x === move.x && m.y === move.y
    );
  }

  _isPieceReachDestination(piece) {
    return piece.reachedDestination;
  }

  _getPlayerMoves(player) {
    const move = [];

    if (player === this.player1) {
      move.push(GameMove.Up, GameMove.Left, GameMove.Right);
    } else {
      move.push(GameMove.Right, GameMove.Up, GameMove.Down);
    }

    return move;
  }

  _displayBoard() {
    console.log(
      this.board
        .map((row) => row.map((cell) => (cell ? cell.color : "_")).join(" | "))
        .join("\n")
    );
  }


  saveState() {
    let state = {
      id: this.id,
      player1: this.player1.saveState(),
      player2: this.player2.saveState(),
      currentPlayer: this.currentPlayer.id,
      winner: this.winner ? this.winner.id : null,
      isOver: this.isOver,
    };

    return state;
  }

  restoreState(state) {
    this.id = state.id;
    
    // fill board with null
    this.board = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }, () => null)
    );

    this.player1.restoreState(state.player1);
    this.player2.restoreState(state.player2);

    this.player1.pieces.forEach(piece => {
      this.board[piece.x][piece.y] = piece;
    });

    this.player2.pieces.forEach(piece => {
      this.board[piece.x][piece.y] = piece;
    });

    this.currentPlayer = state.currentPlayer === this.player1.id ? this.player1 : this.player2;
    this.winner = state.winner ? (state.winner === this.player1.id ? this.player1 : this.player2) : null;
    this.isOver = state.isOver;
  }
}


/* const game = new Game(3, new Player("player1"), new Player("player2"));
console.log(game.player1);

const state = game.saveState();
game.move(game.player1.pieces[0].id, GameMove.Right);

console.log("\n\n After move \n\n");

game.restoreState(state);
console.log(game.player1); */