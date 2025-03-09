import { MinimaxSolver } from "./AIMinimaxSolver.js";
import Piece from "./Piece.js";

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
    // Tạo board trống
    this.board = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }, () => null)
    );
    this.player1 = player1;
    this.player2 = player2;

    // Nếu không truyền skipInit=true thì mới khởi tạo board và đẩy quân
    if (!skipInit) {
      this._initializeBoard();
    }

    if (player2.isAI) {
      this.AISolver = new MinimaxSolver(this.boardSize, 10);
    }

    this.currentPlayer = player1;
    this.winner = null;
    this.isOver = false;
  }


  _initializeBoard() {
    for (let i = 1; i < this.gameSize; i++) {
      const p1_piece = new Piece(PLAYER1_COLOR, this.player1.id, {
        x: this.gameSize,
        y: i,
      });

      const p2_piece = new Piece(PLAYER2_COLOR, this.player2.id, {
        x: i,
        y: 0,
      });

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
  /* 
  _twoAIsRandomPlay() {  
    while (!this.isOver) {
      const validMoves = this.getCurrentValidMoves();
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      this.move(randomMove.pieceId, randomMove.move);
      this._displayBoard();
    }
  } */

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
      }, 1000);
    });
  }

  move(pieceId, move) {
    if (this.isOver) {
      //console.log("Game is over");
      return;
    }

    if (!this.validateMove(pieceId, move)) {
      return;
    }

    const piece = this.currentPlayer.pieces.find((p) => p.id === pieceId);
    let { newX, newY } = {
      newX: piece.position.x + move.x,
      newY: piece.position.y + move.y,
    };

    if (this._isDestinationTile(newX, newY, this.currentPlayer)) {
      const des =
        this.currentPlayer === this.player1 ? this.player1Des : this.player2Des;

      const emptyDes = des.find((d) => this.board[d.x][d.y] === null);

      if (!emptyDes) {
        //console.log("No empty destination");
        return false;
      }

      ({ x: newX, y: newY } = emptyDes);
    }

    this.board[piece.position.x][piece.position.y] = null;
    this.board[newX][newY] = piece;
    piece.position = { x: newX, y: newY };

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

    this.board[piece.position.x][piece.position.y] = null;
    this.board[newX][newY] = piece;
    piece.position = { x: newX, y: newY };

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

    this._displayBoard();
  }

  validateMove(pieceId, move) {
    const piece = this.currentPlayer.pieces.find((p) => p.id === pieceId);
    if (!piece) {
      //console.log("Invalid piece");
      return false;
    }

    if (!this._isCurrentPLayerMove(move)) {
      //console.log("Invalid move");
      return false;
    }

    if (this._isPieceReachDestination(piece)) {
      //console.log("Piece already reached destination");
      return false;
    }

    const { newX, newY } = {
      newX: piece.position.x + move.x,
      newY: piece.position.y + move.y,
    };

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

    if (!this._isOneStepMove(piece.position.x, piece.position.y, newX, newY)) {
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

  validateNewTile(pieceId, newX, newY) {
    const piece = this.currentPlayer.pieces.find((p) => p.id === pieceId);
    if (!piece) {
      //console.log("Invalid piece");
      return false;
    }

    if (
      !this._isCurrentPLayerMove({
        x: newX - piece.position.x,
        y: newY - piece.position.y,
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

    if (!this._isOneStepMove(piece.position.x, piece.position.y, newX, newY)) {
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
      (x - newX) * (y - newY) === 0
    ); // can move cross
  }

  _isCurrentPLayerMove(move) {
    return this._getPlayerMoves(this.currentPlayer).some(
      (m) => m.x === move.x && m.y === move.y
    );
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

  _isPieceReachDestination(piece) {
    return piece.reachedDestination;
  }

  getSameIdClone() {
    const clonedPlayer1 = this.player1.getSameIdClone();
    const clonedPlayer2 = this.player2.getSameIdClone();

    // Tạo clone mà không gọi _initializeBoard (skipInit = true)
    const clone = new Game(this.gameSize, clonedPlayer1, clonedPlayer2, true);
    clone.id = this.id;
    // Copy trạng thái board hiện tại
    clone.board = this.board.map((row) =>
      row.map((cell) => (cell ? cell.getSameIdClone() : null))
    );
    // Đảm bảo currentPlayer được copy đúng
    clone.currentPlayer =
      this.currentPlayer === this.player1 ? clonedPlayer1 : clonedPlayer2;
    clone.winner = this.winner;
    clone.isOver = this.isOver;

    clone.player1Des = this.player1Des;
    clone.player2Des = this.player2Des;

    return clone;
  }
}

/* const player1 = new Player("player1");
const player2 = new Player("player2");

const game = new Game(3, player1, player2);
const game2 = game.getSameIdClone();

console.log(game);
console.log(game2); */

/* const player1 = new Player("player1");
const player2 = new Player("player2");

const game = new Game(3, player1, player2);
game.TwoAIsRandomPlay(); */
/* 
game.playTurn(player1.pieces[0].id, GameMove.Up);
console.log("\n------------------\n");
game.playTurn(player2.pieces[0].id, GameMove.Right);
console.log("\n------------------\n");
game.playTurn(player1.pieces[0].id, GameMove.Up);
console.log("\n------------------\n");
game.playTurn(player2.pieces[0].id, GameMove.Right);
console.log("\n------------------\n");
game.playTurn(player1.pieces[1].id, GameMove.Up);
console.log("\n------------------\n");
game.playTurn(player2.pieces[0].id, GameMove.Right);
console.log("\n------------------\n");

game.playTurn(player1.pieces[0].id, GameMove.Up);
console.log("\n------------------\n");

game.playTurn(player2.pieces[0].id, GameMove.Right);
console.log("\n------------------\n");


game.playTurn(player1.pieces[0].id, GameMove.Up);
console.log("\n------------------\n");

game.playTurn(player2.pieces[1].id, GameMove.Right);
console.log("\n------------------\n");
 */
