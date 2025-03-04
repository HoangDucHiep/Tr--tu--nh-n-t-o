import React, { useState } from "react";
import Board from "./components/Board/Board";
import { Game } from "./core/Game";
import { Player } from "./core/Player";
import "./styles/App.css";
import "./styles/Game.css";
import Setting from "./components/Setting/Setting";

function App() {
  const [mode, setMode] = useState("PvC");
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleNameInput = (event) => {
    if (event.target.id === "player1") {
      setPlayer1Name(event.target.value);
    } else {
      setPlayer2Name(event.target.value);
    }
  };

  const createNewGame = () => {
    const player1 = new Player(player1Name, false);
    const player2 = new Player(player2Name, false);

    const game = new Game(player1, player2);

    setPlayer1(player1);
    setPlayer2(player2);
    setGame(game);

    setBoard(game.board.map(row => [...row]));
  };

  const handleMove = (pieceId, newPosition) => {
    const piece = game.getPieceById(pieceId);
    if (!piece) return;

    game._movePiece(piece, newPosition);
    setBoard(game.board.map(row => [...row]));
    game._printBoard();
  };

  const checkValidMove = (pieceId, newPosition) => {
    const piece = game.getPieceById(pieceId);
    if (!piece) return false;

    return game._isValidMove(piece, newPosition);
  };

  !game || game._printBoard();

  return (
    <div>
      <h1 id="title">Dodgem ProVjp Game</h1>
      <div
        className="mainGameContainer"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Setting
          isPlaying={(game && !game?.gameOver) || false}
          currentMode={mode}
          onModeChange={handleModeChange}
          onNameInput={handleNameInput}
          onNewGameClick={createNewGame}
        ></Setting>
        <div>
          <Board board={board} onMove={handleMove} isValid={checkValidMove} />

            <div
              style={{
                width: "100%",
                display: "flex",
                color:
                  game && !game.gameOver && game.currentPlayerIndex === 0
                    ? "rgba(255, 65, 65, 0.63)"
                    : "rgba(101, 70, 255, 0.8)",
                fontSize: "1.5rem",
                marginTop: "1rem",
              }}
            >
              {game && !game.gameOver
                ? `Current turn: ${game.players[game.currentPlayerIndex].name}`
                : null}
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                color:
                  game && game.gameOver && game.currentPlayerIndex === 0
                    ? "rgba(255, 65, 65, 0.63)"
                    : "rgba(101, 70, 255, 0.8)",
                fontSize: "1.5rem",
                marginTop: "1rem",
              }}
            >
              {game && game.winner ? `Winner: ${game.winner.name}`
                : null}
            </div>

        </div>
      </div>
    </div>
  );
}

export default App;
