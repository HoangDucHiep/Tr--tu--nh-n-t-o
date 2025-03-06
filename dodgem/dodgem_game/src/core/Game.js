import { Piece } from "./Piece.js";
import { Player } from "./Player.js";



class Game {
  constructor(player1, player2, boardSize = 3) {
    this.boardSize = boardSize;
    this.players = [player1, player2];
    this.desTiles = {};
    this.currentPlayerIndex = 0;
    this.board = this._initializeBoard();
    this.history = [];
    this.gameOver = false;
    this.winner = null;
  }

  _initializeBoard() {
    const board = Array.from({ length: this.boardSize + 1 }, () =>
      Array(this.boardSize + 1).fill(null)
    );

    const player1 = this.players[0];
    const player2 = this.players[1];

    const player1Des = Array.from({ length: board.length - 1 }, (_, i) => ({ x: i + 1, y: board.length - 1 }));
    const player2Des = Array.from({ length: board.length - 1 }, (_, i) => ({ x: 0, y: i }));

    this.desTiles = [player1Des, player2Des]

    for (let i = 1; i < this.boardSize; i++) {
      const newPiece1 = new Piece(`p1_${i}`, 'red', { x: i, y: 0 });
      newPiece1.owner = 0; // gán chủ sở hữu cho player 1
      board[i][0] = newPiece1;
      player1.pieces.push(newPiece1);
    
      const newPiece2 = new Piece(`p2_${i}`, 'blue', { x: this.boardSize, y: i });
      newPiece2.owner = 1; // gán chủ sở hữu cho player 2
      board[this.boardSize][i] = newPiece2;
      player2.pieces.push(newPiece2);
    }
    return board;
  }

  _movePiece(piece, newPosition) {
    const { x, y } = piece.position;
    const { x: newX, y: newY } = newPosition;

    this.board[x][y] = null;
    this.board[newX][newY] = piece;
    piece.position = newPosition;

    if (this._inDestinationTile(piece)) {
      this.players[piece.owner].pieces = this.players[piece.owner].pieces.filter(p => p.id !== piece.id);
      this.board[newX][newY] = null;
      console.log(this.players[piece.owner].pieces);
    }

    if (this.players[this.currentPlayerIndex].pieces.length === 0) {
      this.gameOver = true;
      this.winner = this.players[this.currentPlayerIndex];
      console.log(`Player ${this.currentPlayerIndex + 1} wins!`);
    }

    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
  }

  _isValidMove(piece, newPosition) {
    const { x, y } = piece.position;
    const { x: newX, y: newY } = newPosition;

    if (!this.players[this.currentPlayerIndex].pieces.some(p => p.id === piece.id)) {
      console.log("piece does not belong to the current player");
      return false;
    }

    if (this.currentPlayerIndex === 0 && newY < y) {
      console.log("player 1 can't move left");
      return false;
    }

    if (this.currentPlayerIndex === 1 && newX > x) {
      console.log("player 2 can't move down");
      return false;
    }

    // check if new position is within the board
    if (
      newX < 0 ||
      newX >= this.boardSize + 1 ||
      newY < 0 ||
      newY >= this.boardSize + 1
    ) {
      return false;
    }

    if (this.board[newX][newY]) {
      // new position is empty
      return false;
    }

    // only move 1 step, the last condition is to make sure u can go cross :>
    if (Math.abs(newX - x) > 1 || Math.abs(newY - y) > 1 || (newX - x) * (newY - y) !== 0) {
      return false;
    }

    // can't move to other players's destination tile
    if (this.desTiles[1 - this.currentPlayerIndex].findIndex((tile) => tile.x === newX && tile.y === newY) !== -1) {
      return false;
    }

    return true;
  }

  _inDestinationTile(piece) {
    const { x, y } = piece.position;
    const desTile = this.desTiles[piece.owner]; // sử dụng owner thay vì currentPlayerIndex
    return desTile.findIndex((tile) => tile.x === x && tile.y === y) !== -1;
  }

  getPieceById(pieceId) {
    for (const player of this.players) {
      const piece = player.pieces.find(p => p.id === pieceId);
      if (piece) return piece;
    }
    return null;
  }

  // FOR TESTING ONLY
  _printBoard() {
    console.log(
      this.board
        .map((row) => row.map((cell) => (cell ? cell.color : "_")).join(" | "))
        .join("\n")
    );
  }
}

export { Game };