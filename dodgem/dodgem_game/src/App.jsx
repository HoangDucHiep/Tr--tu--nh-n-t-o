import React, { useState } from 'react';
import Board from './components/Board/Board';
import { Game } from "./core/Game";
import { Player } from "./core/Player";
import './styles/App.css';
import './styles/Game.css'
import Setting from './components/Setting/Setting';

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

  game._printBoard();
  console.log(game.desTiles);

  return (
    <div>
      <h1 id='title'>Dodgem ProVjp Game</h1>
      <div className='mainGameContainer'
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Setting></Setting>
        <Board board={board} onMove={handleMove} isValid={checkValidMove} />
      </div>
    </div>
  );
}

export default App;