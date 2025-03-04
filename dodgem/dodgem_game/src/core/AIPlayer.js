import { Player } from './Player';

export class AIPlayer extends Player {
  constructor(name) {
    super(name, true);
  }

  generateMove(game) {
    const availableMoves = this.getAvailableMoves(game);
    if (availableMoves.length === 0) return null;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  getAvailableMoves(game) {
    const moves = [];
    for (const piece of this.pieces) {
      const { x, y } = piece.position;
      const potentialMoves = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ];
      for (const newPosition of potentialMoves) {
        if (game._isValidMove(piece, newPosition)) {
          moves.push({ piece, newPosition });
        }
      }
    }
    return moves;
  }
}