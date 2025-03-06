export default class Player {
  constructor(name, isAI = false) { 
    this.id = `player-${name}-${crypto.randomUUID()}`;
    this.name = name;
    this.pieces = [];
    this.isAI = isAI;
  }

  clone() {
    const player = new Player(this.name, this.isAI);
    player.pieces = this.pieces.map(p => p.clone());
    return player;
  }

  sameIdClone() {
    const player = new Player(this.name, this.isAI);
    player.pieces = this.pieces.map(p => p.sameIdClone());
    player.id = this.id;
    return player;
  }
}