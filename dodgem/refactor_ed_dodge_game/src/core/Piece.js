export default class Piece {
  constructor(color, playerId, position) { 
    this.id = `piece-${color}-${playerId}-${crypto.randomUUID()}`;
    this.color = color;
    this.player = playerId;
    this.position = position;
  }
}