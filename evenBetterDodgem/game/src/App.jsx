import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Setting from "./components/Setting";
import PopUp from "./components/PopUp";
import Board from "./components/Board/Board";
import HistoryBoard from "./components/HistoryBoard";

import { useState } from "react";
import "./styles/App.css";
import "./styles/Board.css";
import Player from "./core/Player.js";
import Game from "./core/Game";

import waitingGif from "./assert/gif/waiting.gif"; // with import

function App() {
  // setting thinsg
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState("PvC");
  const [gameSize, setGameSize] = useState(3);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [isOver, setIsOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);

  const [isAIPlaying, setIsAIPlaying] = useState(false);

  // funtions

  const onModeChange = (e) => {
    setCurrentMode(e.target.value);
  };

  const onNameInput = (e) => {
    if (e.target.id === "player1") {
      setPlayer1Name(e.target.value);
    } else {
      setPlayer2Name(e.target.value);
    }
  };

  const onSizeChange = (e) => {
    setGameSize(Number(e.target.value));
  };

  const onStartGame = () => {
    let p1Name;
    let p2Name;

    if (currentMode === "PvP") {
      p1Name = player1Name || "Player 1";
      p2Name = player2Name || "Player 2";
    } else if (currentMode === "PvC") {
      p1Name = player1Name || "Player";
      p2Name = "Computer";
    }
    setPlayer1Name(p1Name);
    setPlayer2Name(p2Name);

    const player1 = new Player(p1Name);
    const player2 = new Player(p2Name, currentMode === "PvC");

    const game = new Game(gameSize, player1, player2);

    setGame(game);
    setBoard(game.board);
    setIsPlaying(true);
    setIsOver(false);
    setWinner(null);
  };

  const onNewGame = () => {
    setGame(null);
    setBoard(null);
    setIsPlaying(false);
    setIsOver(false);
    setWinner(null);
  };

  const handleMove = async (pieceId, newX, newY) => {
    if (game.isOver) return;

    game.put(pieceId, newX, newY);
    setBoard(game.board.map((row) => [...row]));

    if (game.isOver) {
      setIsOver(true);
      setIsPlaying(false);
      setWinner(game.winner.name);
    }

    if (game.currentPlayer.isAI) {
      setIsAIPlaying(true);
      await game.AIMove();
      setIsAIPlaying(false);
      setBoard(game.board.map((row) => [...row]));

      if (game.isOver) {
        setIsOver(true);
        setIsPlaying(false);
        setWinner(game.winner.name);
      }
    }
  };

  const onGameOver = () => {
    setGame(null);
    setBoard(null);
    setIsPlaying(false);
  };

  const isCurrentPlayerPiece = (pieceId) => {
    return game.currentPlayer.pieces.find((p) => p.id === pieceId);
  };

  return (
    <div className="App">
      <h1 className="game-name">Dodgem Provjp Max</h1>
      <div className="flex-container">
        <div className="flex-item-1">
          <Setting
            isPlaying={isPlaying}
            currentMode={currentMode}
            onModeChange={onModeChange}
            onNameInput={onNameInput}
            onStartGameClick={onStartGame}
            onNewGameClick={onNewGame}
            onChangeSize={onSizeChange}
          />
        </div>
        <div className="flex-item-2">
          <div>
            <DndProvider backend={HTML5Backend}>
              {game ? (
                <Board
                  board={board}
                  onMove={handleMove}
                  isValid={(id, x, y) => game.validateNewTile(id, x, y)}
                  isCurrentPlayerPiece={isCurrentPlayerPiece}
                />
              ) : (
                <div>Settings and click Start Game first</div>
              )}
            </DndProvider>
            {isPlaying && isAIPlaying && (
              <div style={{ textAlign: "center" }}>
                <img src={waitingGif} width={100} height={100} />
                <p>Computer is playing ...</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-item-3">
          <HistoryBoard />
        </div>
      </div>
      {game && isOver && (
        <PopUp
          open={isOver}
          title={"Game Over"}
          content={`The winner is ${winner}!!!`}
          onClick={() => onGameOver()}
        />
      )}
    </div>
  );
}

export default App;
