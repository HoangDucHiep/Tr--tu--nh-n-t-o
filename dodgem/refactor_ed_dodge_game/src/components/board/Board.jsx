import BoardTile from "./BoardTile";
import Piece from "./Piece";
import Tile from "./Tile";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Board = ({ board, onMove, isValid, isCurrentPlayerPiece }) => {
  if (!board) {
    return <div>Loading board...</div>;
  }

  const isDestination = (x, y) => {
    return (
      (x === 0 && y < board.length - 1) ||
      (x > 0 && y === board.length - 1)
    );
  };

  const isDimmed = (x, y) => {
    return x === 0 || y === board.length - 1;
  };

  return (
    <DndProvider
      backend={HTML5Backend}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${board.length}, 1fr)`,
          gridTemplateRows: `repeat(${board.length}, 1fr)`,
          gap: "5px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <BoardTile
              key={`${rowIndex}-${colIndex}`}
              x={rowIndex}
              y={colIndex}
              onMove={onMove}
              isValid={isValid}
              isDestination={isDestination(rowIndex, colIndex)}
              isDimmed={isDimmed(rowIndex, colIndex)}
            >
              {cell && (
                <Piece
                  key={cell.id}
                  id={cell.id}
                  color={cell.color}
                  position={cell.position}
                  canDrag={() => isCurrentPlayerPiece(cell.id)}
                />
              )}
            </BoardTile>
          ))
        )}
      </div>
    </DndProvider>
  );
};

export default Board;
