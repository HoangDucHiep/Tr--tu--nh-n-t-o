import BoardSquare from "./BoardSquare";
import Piece from "./Piece";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Board = ({ board, onMove, isValid }) => {
  if (!board) return <div>Loading board...</div>;

  const blueDestinations = Array.from({ length: board.length - 1 }, (_, i) => i);
  const redDestinations = Array.from({ length: board.length - 1 }, (_, i) => i + 1);

  const isDestination = (x, y) => {
    return (x === 0 && blueDestinations.includes(y)) || (redDestinations.includes(x) && y === board.length - 1);
  };

  const isDimmed = (x, y) => {
    return x === 0 || y === board.length - 1;
  };



  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="board"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${board.length}, 100px)`,
          gridTemplateRows: `repeat(${board.length}, 100px)`,
          gap: "5px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <BoardSquare
              key={`${rowIndex}-${colIndex}`}
              x={rowIndex}
              y={colIndex}
              onMove={onMove}
              isValid={isValid}
              isDestination={isDestination(rowIndex, colIndex)}
              isDimmed={isDimmed(rowIndex, colIndex)}
            >
              {cell && <Piece id={cell.id} color={cell.color} position={cell.position} />}
            </BoardSquare>
          ))
        )}
      </div>
    </DndProvider>
  );
};

export default Board;