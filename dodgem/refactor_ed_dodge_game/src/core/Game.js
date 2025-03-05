import Piece from "./Piece.js";

import Player from "./Player.js";

export const PLAYER1 = 0;
export const PLAYER2 = 1;
export const PLAYER1_COLOR = "red";
export const PLAYER2_COLOR = "blue";

export default class Game {
  constructor(size) {
    this.id = `game-${Date.now()}`;
    this.gameSize = size;
    this.boardSize = size + 1;
    this.id = `game-${Date.now()}`;
    this.players = [];
    this.board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(null)
    );
    this.currentPlayer = PLAYER1;
    this.winner = null;
    this.isOver = false;
  }

  start(player1, player2) {
    this.players = [player1, player2];
    this.#initializeBoard();
  }

  playTurn(pieceId, newPosition) { 
    if (this.isOver) return false;

    if (!this.validateMove(pieceId, newPosition)) return false;

    const piece = this.players[this.currentPlayer].pieces.find(
      (p) => p.id === pieceId
    );

    this.board[piece.position.x][piece.position.y] = null;
    piece.position = newPosition;
    this.board[piece.position.x][piece.position.y] = piece;

    if (this.#isInDestinationTile(piece)) {
      this.players[this.currentPlayer].pieces = this.players[
        this.currentPlayer
      ].pieces.filter((p) => p.id !== pieceId);
      console.log("Piece reached destination");
      console.log(this.players[this.currentPlayer].pieces);
      this.board[piece.position.x][piece.position.y] = null;
    }

    if (this.players[this.currentPlayer].pieces.length === 0) {
      this.isOver = true;
      this.winner = this.currentPlayer;
      console.log(`Player ${this.players[this.winner].name} wins!`);
    }

    this.currentPlayer = this.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
    return true;
  }

  aiMove() {
    return new Promise((resolve) => {
      if (this.isOver) return resolve(false);
  
      const pieces = this.players[this.currentPlayer].pieces;
      const validMoves = [];
  
      pieces.forEach(piece => {
        const { x, y } = piece.position;
        const possibleMoves = [
          { x: x - 1, y }, // up
          { x: x + 1, y }, // down
          { x, y: y - 1 }, // left
          { x, y: y + 1 }  // right
        ];
  
        possibleMoves.forEach(move => {
          if (this.validateMove(piece.id, move)) {
            validMoves.push({ pieceId: piece.id, newPosition: move });
          }
        });
      });
  
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        setTimeout(() => {
          this.playTurn(randomMove.pieceId, randomMove.newPosition);
          resolve(true);
        }, 100); // Delay 100ms for AI move
      } else {
        resolve(false);
      }
    });
  }

  validateMove(pieceId, newPosition) {
    const piece = this.players[this.currentPlayer].pieces.find(
      (p) => p.id === pieceId
    );
    if (!piece) {
      console.log("Piece not found");
      return false;
    }

    const { x, y } = piece.position;
    const { x: newX, y: newY } = newPosition;

    // check if the new position is within the board
    if (
      newX < 0 ||
      newX >= this.boardSize ||
      newY < 0 ||
      newY >= this.boardSize
    ) {
      console.log("Invalid move, out of board");
      return false;
    }

    // check if the new position is empty
    if (this.board[newX][newY]) {
      console.log("Invalid move, position is not empty");
      return false;
    }

    // move only one step
    if (Math.abs(x - newX) > 1 || Math.abs(y - newY) > 1) {
      console.log("Invalid move, can only move one step");
      return false;
    }

    // check to ensure no cross move
    if (Math.abs(x - newX) * Math.abs(y - newY) !== 0) {
      console.log("Invalid move, can only move in one direction");
      return false;
    }
    

    // check if the new position is not the other player's destination
    const otherPlayerDes = this.currentPlayer === PLAYER1 ? this.player2Des : this.player1Des;
    if (otherPlayerDes.some((des) => des.x === newX && des.y === newY)) {
      console.log("You can't move to the other player's destination");
      return false;
    }

    // for player1, can only move up, left, right
    if (this.currentPlayer === PLAYER1) {
      if (newX > x) {
        console.log("Invalid move, can only move up");
        return false;
      }
    }

    // for player2, can only move right, up, down
    if (this.currentPlayer === PLAYER2) {
      if (newY < y) {
        console.log("Invalid move, can only move right");
        return false;
      }
    }


    return true;
  }

  

  #isInDestinationTile(piece) {
    const playerId = piece.player;
    const destination = this.players[PLAYER1].id === playerId ? this.player1Des : this.player2Des;
    return destination.some((des) => des.x === piece.position.x && des.y === piece.position.y);
  }

  #initializeBoard() {
    const player1 = this.players[PLAYER1];
    const player2 = this.players[PLAYER2];

    for (let i = 1; i < this.gameSize; i++) {
      const p1_piece = new Piece(PLAYER1_COLOR, player1.id, {
        x: this.gameSize,
        y: i,
      });
      const p2_piece = new Piece(PLAYER2_COLOR, player2.id, { x: i, y: 0 });

      this.board[this.gameSize][i] = p1_piece;
      this.board[i][0] = p2_piece;

      player1.pieces.push(p1_piece);
      player2.pieces.push(p2_piece);
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

  _displayBoard() {
    console.log(
      this.board
        .map((row) => row.map((cell) => (cell ? cell.color : "_")).join(" | "))
        .join("\n")
    );
  }
}


/* let game = new Game(3);
let player1 = new Player("player1");
let player2 = new Player("player2");

game.start(player1, player2);
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player1.pieces[0].id, { x: 2, y: 1 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player2.pieces[0].id, { x: 1, y: 1 });
console.log("\n------------------\n");
game._displayBoard();


game.playTurn(player1.pieces[1].id, { x: 2, y: 2 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player2.pieces[0].id, { x: 1, y: 2 });
console.log("\n------------------\n");
game._displayBoard();


game.playTurn(player1.pieces[0].id, { x: 1, y: 1 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player2.pieces[0].id, { x: 1, y: 3 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player1.pieces[0].id, { x: 0, y: 1 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player2.pieces[0].id, { x: 2, y: 1 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player1.pieces[0].id, { x: 1, y: 2 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player2.pieces[0].id, { x: 2, y: 2 });
console.log("\n------------------\n");
game._displayBoard();

game.playTurn(player1.pieces[0].id, { x: 0, y: 2 });
console.log("\n------------------\n");
game._displayBoard(); */