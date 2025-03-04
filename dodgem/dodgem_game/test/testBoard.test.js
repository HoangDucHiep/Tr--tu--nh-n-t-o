import { test } from 'node:test'
import assert from 'node:assert'
import { Game } from '../src/core/Game.js'
import { Piece } from '../src/core/Piece.js'
import { Player } from '../src/core/Player.js'
import { AIPlayer } from '../src/core/AIPlayer.js'

test('test board initialization', () => {
  const player1 = new Player([
    new Piece(1, 'X'),
    new Piece(2, 'X'),
  ]);

  const player2 = new Player([
    new Piece(4, 'O'),
    new Piece(5, 'O'),
  ]);

  const game = new Game(player1, player2);

  const expectedBoard = [
    [player1.pieces[0], null, null],
    [player1.pieces[1], null, null],
    [null, player2.pieces[0], player2.pieces[1]]
  ];

  assert.deepStrictEqual(game.board, expectedBoard);
});

test('test move piece', () => {
  const player1 = new Player([
    new Piece(1, 'X'),
    new Piece(2, 'X'),
  ]);

  const player2 = new Player([
    new Piece(4, 'O'),
    new Piece(5, 'O'),
  ]);

  const game = new Game(player1, player2);

  game._movePiece(player1.pieces[0], { x: 0, y: 1 });

  const expectedBoard = [
    [null, player1.pieces[0], null],
    [player1.pieces[1], null, null],
    [null, player2.pieces[0], player2.pieces[1]]
  ];

  assert.deepStrictEqual(game.board, expectedBoard);
});