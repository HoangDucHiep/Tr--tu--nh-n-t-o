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
}