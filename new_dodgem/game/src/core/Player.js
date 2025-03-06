export default class Player {
  constructor(name, isAI = false) { 
    this.id = `player-${name}-${crypto.randomUUID()}`;
    this.name = name;
    this.pieces = [];
    this.isAI = isAI;
  }

  getSameIdClone() {
    const player = new Player(this.name, this.isAI);
    player.pieces = this.pieces.map(p => p.getSameIdClone());
    player.id = this.id;
    return player;
  }
}