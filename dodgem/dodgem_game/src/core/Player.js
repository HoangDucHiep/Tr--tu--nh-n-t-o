import { Piece } from "./Piece.js";

export class Player {
  constructor(name, isAI = false) {
    this.name = name;
    this.pieces = [];
    this.isAI = isAI;
  }

  /* getValidMoves(game) {
    return [];
  } */
}