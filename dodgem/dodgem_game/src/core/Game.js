import { Piece } from "./Piece.js";
import { Player } from "./Player.js";

class Game {
  constructor(player1, player2, boardSize = 3) {
    this.boardSize = boardSize;
    this.players = [player1, player2];
    this.currentPlayerIndex = 0;
    this.board = this._initializeBoard();
    this.history = [];
    this.gameOver = false;
    this.winnder = null;
  }

  _initializeBoard() {
    const board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(null)
    );

    const player1 = this.players[0];
    const player2 = this.players[1];
    for (let i = 0; i < this.boardSize - 1; i++) {
      const newPiece1 = new Piece(`p1_${i}`, 'red', { x: i, y: 0 });
      board[i][0] = newPiece1;
      player1.pieces.push(newPiece1);

      const newPiece2 = new Piece(`p2_${i}`,'blue', { x: this.boardSize - 1, y: i + 1 });
      board[this.boardSize - 1][i + 1] = newPiece2;
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

    this.currentPlayerIndex = 1 - this.currentPlayerIndex;

  }

  _isValidMove(piece, newPosition) {
    const { x, y } = piece.position;
    const { x: newX, y: newY } = newPosition;

    if (this.players[this.currentPlayerIndex].pieces.indexOf(piece) === -1) {
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
      newX >= this.boardSize ||
      newY < 0 ||
      newY >= this.boardSize
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

    return true;
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
    /* 
    X |  |  |
    X |  |  |
      | O | O
    */

    console.log(
      this.board
        .map((row) => row.map((cell) => (cell ? cell.color : "_")).join(" | "))
        .join("\n")
    );
  }
}

// test
/* const player1 = new Player([
  new Piece(1, 'X'),
  new Piece(2, 'X')
], false);

const player2 = new Player([
  new Piece(3, 'O'),
  new Piece(4, 'O')
], false);

const game = new Game(player1, player2);

game._printBoard();
console.log("\n-------------------\n");

game._movePiece(player1.pieces[0], { x: 0, y: 1 });
game._printBoard();

console.log("\n-------------------\n");
game._movePiece(player1.pieces[1], { x: 1, y: 1 });
game._printBoard();
*/
export { Game };
