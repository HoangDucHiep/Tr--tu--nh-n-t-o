import { describe, test } from 'node:test'
import assert from 'node:assert'
import Game from '../src/core/Game.js'
import Piece from '../src/core/Piece.js'
import Player from '../src/core/Player.js'

describe('Game 3 * 3', () => {
  test('should initialize a 3 * 3 board', () => {
    let game = new Game(3);
    assert.equal(game.board.length, 4);
    assert.equal(game.board[0].length, 4);
  });

  test('pieces in right place after initialization', () => { 
    let game = new Game(3);
    let player1 = new Player("player1");
    let player2 = new Player("player2");
    game.start(player1, player2);

    assert.equal(player1.pieces.length, 2);
    assert.equal(player2.pieces.length, 2);

    assert.equal(game.board[3][1].color, "red");
    assert.equal(game.board[3][2].color, "red");
    assert.equal(game.board[1][0].color, "blue");
    assert.equal(game.board[2][0].color, "blue");
  });

  test('right destination tiles', () => {
    let game = new Game(3);
    let player1 = new Player("player1");
    let player2 = new Player("player2");
    game.start(player1, player2);

    assert.equal(game.player1Des.length, 3);
    assert.equal(game.player2Des.length, 3);

    assert.equal(game.player1Des[0].x, 0);
    assert.equal(game.player1Des[0].y, 0);
    assert.equal(game.player1Des[1].x, 0);
    assert.equal(game.player1Des[1].y, 1);
    assert.equal(game.player1Des[2].x, 0);
    assert.equal(game.player1Des[2].y, 2);

    assert.equal(game.player2Des[0].x, 1);
    assert.equal(game.player2Des[0].y, 3);
    assert.equal(game.player2Des[1].x, 2);
    assert.equal(game.player2Des[1].y, 3);
    assert.equal(game.player2Des[2].x, 3);
    assert.equal(game.player2Des[2].y, 3);
  });
});


describe('Game 4 * 4', () => { 
  test('should initialize a 4 * 4 board', () => {
    let game = new Game(4);
    assert.equal(game.board.length, 5);
    assert.equal(game.board[0].length, 5);
  });


  test('pieces in right place after initialization', () => { 
    let game = new Game(4);
    let player1 = new Player("player1");
    let player2 = new Player("player2");
    game.start(player1, player2);

    assert.equal(player1.pieces.length, 3);
    assert.equal(player2.pieces.length, 3);

    assert.equal(game.board[4][1].color, "red");
    assert.equal(game.board[4][2].color, "red");
    assert.equal(game.board[4][3].color, "red");

    assert.equal(game.board[1][0].color, "blue");
    assert.equal(game.board[2][0].color, "blue");
    assert.equal(game.board[3][0].color, "blue");
  });

  test('right destination tiles', () => {
    let game = new Game(4);
    let player1 = new Player("player1");
    let player2 = new Player("player2");
    game.start(player1, player2);

    assert.equal(game.player1Des.length, 4);
    assert.equal(game.player2Des.length, 4);

    assert.equal(game.player1Des[0].x, 0);
    assert.equal(game.player1Des[0].y, 0);
    assert.equal(game.player1Des[1].x, 0);
    assert.equal(game.player1Des[1].y, 1);
    assert.equal(game.player1Des[2].x, 0);
    assert.equal(game.player1Des[2].y, 2);
    assert.equal(game.player1Des[3].x, 0);
    assert.equal(game.player1Des[3].y, 3);

    assert.equal(game.player2Des[0].x, 1);
    assert.equal(game.player2Des[0].y, 4);
    assert.equal(game.player2Des[1].x, 2);
    assert.equal(game.player2Des[1].y, 4);
    assert.equal(game.player2Des[2].x, 3);
    assert.equal(game.player2Des[2].y, 4);
    assert.equal(game.player2Des[3].x, 4);
    assert.equal(game.player2Des[3].y, 4);
  });
});