import './App.css';
import './assets/styles/Board.css';
import Board from './components/board/Board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import Game from "./core/Game";
import Player from "./core/Player";
import Setting from "./components/settings/Setting";  
import HistoryBoard from './components/moveHistory/historyBoard';
import PopUp from "./components/PopUp";

function App() {
  // setting thinsg
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState("PvC");
  const [gameSize, setGameSize] = useState(3);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [isOver, setIsOver] = useState(false);
  const [winner, setWinner] = useState(null);

  
  // game thinsg
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);

  const onModeChange = (e) => {
    setCurrentMode(e.target.value);
  }

  const onNameInput = (e) => {
    if (e.target.id === "player1") {
      setPlayer1Name(e.target.value);
    } else {
      setPlayer2Name(e.target.value);
    }
  }

  const onSizeChange = (e) => {
    setGameSize(Number(e.target.value));
  }

  const onStartGame = () => {
    const p1Name = player1Name === "" ? "Player 1" : player1Name;
    const p2Name = player2Name === "" ? "Player 2" : player2Name;

    if (player1Name === "") {
      setPlayer1Name(p1Name);
    }

    if (currentMode === "PvP" && player2Name === "") {
      setPlayer2Name(p2Name);
    } else if (currentMode === "PvC") {
      setPlayer2Name("Computer");
    }

    const player1 = new Player(p1Name);
    const player2 = new Player(p2Name, currentMode === "PvC");

    const newGame = new Game(gameSize);
    newGame.start(player1, player2);
    setIsPlaying(true);
    setGame(newGame);
    setBoard(newGame.board.map(row => [...row]));
    setIsOver(false); // Reset trạng thái isOver khi bắt đầu trò chơi mới
    setWinner(null); // Reset trạng thái winner khi bắt đầu trò chơi mới
  }

  const handleMove = async (pieceId, newPosition) => {
    if (game) {
      game.put(pieceId, newPosition);
      setBoard(game.board.map(row => [...row]));
      
      if (game.isOver) {
        setIsOver(true);
        setIsPlaying(false);
        setWinner(game.players[game.winner].name);
      } else if (game.players[game.currentPlayer].isAI) {
        await game.aiMove();
        if (game.isOver) {
          setIsOver(true);
          setIsPlaying(false);
          setWinner(game.players[game.winner].name);
        }
        setBoard(game.board.map(row => [...row]));
      }
    }
  };

  const onGameOver = () => { 
    setGame(null);
    setBoard(null);
    setIsPlaying(false);
  }


  const isCurrentPlayerPiece = (pieceId) => {
    return game.players[game.currentPlayer].pieces.find(p => p.id === pieceId);
  }


  return (
    <div className="App">
      <h1 className='game-name'>Dodgem Provjp Max</h1>
      <div className="flex-container">
        <div className="flex-item-1">
          <Setting
            isPlaying={isPlaying}
            currentMode={currentMode}
            onModeChange={onModeChange}
            onNameInput={onNameInput}
            onNewGameClick={onStartGame} 
            onChangeSize={onSizeChange}
          />
        </div>
        <div className="flex-item-2">
          <DndProvider backend={HTML5Backend}>
            {game ? <Board
              board={board}
              onMove={handleMove}
              isValid={(id, position) => game.validateMove(id, position)}
              isCurrentPlayerPiece={isCurrentPlayerPiece}
            /> : <div>Settings and click Start Game first</div>}
          </DndProvider>
        </div>
        <div className="flex-item-3">
          <HistoryBoard/>
        </div>
      </div>
      {game && isOver &&
        <PopUp
          open={isOver}
          title={"Game Over"}
        content={`The winner is ${winner}!!!`}
        onClick={() => onGameOver()}
        />}
      
    </div>
  );
}

export default App;