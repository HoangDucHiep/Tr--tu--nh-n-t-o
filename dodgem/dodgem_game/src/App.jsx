import React, { useState } from 'react';
import Board from './components/Board/Board';
import { Game } from "./core/Game";
import { Player } from "./core/Player";
import './styles/App.css';

const player1 = new Player('player1', false);
const player2 = new Player('player2', false);

const game = new Game(player1, player2);

function App() {
  const [board, setBoard] = useState(game.board);

  const handleMove = (pieceId, newPosition) => {
    const piece = game.getPieceById(pieceId);
    if (!piece) return;

    game._movePiece(piece, newPosition);
    setBoard([...game.board]);
    game._printBoard();
  };

  const checkValidMove = (pieceId, newPosition) => {
    const piece = game.getPieceById(pieceId);
    if (!piece) return false;

    return game._isValidMove(piece, newPosition);
  }

  return (
    <>
      <Board board={board} onMove={handleMove} isValid={checkValidMove} />
    </>
  );
}

export default App;