export default class Player {
  constructor(name, isAI = false) { 
    this.id = `player-${name}-${crypto.randomUUID()}`;
    this.name = name;
    this.pieces = [];
    this.isAI = isAI;
  }
}