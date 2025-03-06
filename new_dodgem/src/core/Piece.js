export default class Piece {
  constructor(color, playerId, position, reachedDestination = false) {
    this.id = `piece-${playerId}-${color}-${crypto.randomUUID()}`;
    this.color = color;
    this.playerId = playerId;
    this.position = position;
    this.reachedDestination = reachedDestination;
  }


  getSameIdClone() { 
    const clone = new Piece(this.color, this.playerId, this.position, this.reachedDestination);
    clone.id = this.id;
    return clone;
  }
}