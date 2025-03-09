export default class Piece {
  constructor(color, playerId, x, y, reachedDestination = false) {
    this.id = `piece-${playerId}-${color}-${crypto.randomUUID()}`;
    this.color = color;
    this.playerId = playerId;
    this.x = x;
    this.y = y;
    this.reachedDestination = reachedDestination;
  }


  saveState() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      reachedDestination: this.reachedDestination,
    };
  }

  restoreState(state) {
    this.x = state.x;
    this.y = state.y;
    this.reachedDestination = state.reachedDestination;
    return this;
  }
}