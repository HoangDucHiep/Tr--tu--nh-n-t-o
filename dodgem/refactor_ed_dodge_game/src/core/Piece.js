export default class Piece {
  constructor(color, playerId, position) { 
    this.id = `piece-${color}-${playerId}-${crypto.randomUUID()}`;
    this.color = color;
    this.player = playerId;
    this.position = position;
  }

  clone() {
    return new Piece(this.color, this.player, { ...this.position });
  }

  sameIdClone() {
    const newPiece = new Piece(this.color, this.player, { ...this.position });
    newPiece.id = this.id;
    return newPiece;
  }
}