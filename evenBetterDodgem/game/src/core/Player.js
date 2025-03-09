export default class Player {
  constructor(name, isAI = false) { 
    this.id = `player-${name}-${crypto.randomUUID()}`;
    this.name = name;
    this.pieces = [];
    this.isAI = isAI;
  }

  saveState() {
    return {
      id: this.id,
      pieces: this.pieces.map(piece => piece.saveState()),
    }
  }

  restoreState(state) {
    this.id = state.id;
    this.pieces.forEach(piece => {
      const savedPiece = state.pieces.find(savedPiece => savedPiece.id === piece.id);
      piece.restoreState(savedPiece);
    });
  }
}