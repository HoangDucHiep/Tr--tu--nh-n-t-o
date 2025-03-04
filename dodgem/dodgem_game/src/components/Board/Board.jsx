import BoardSquare from "./BoardSquare";
import Piece from "./Piece";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Board = ({ board, onMove, isValid }) => {
  if (!board) return <div>Loading board...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="board"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${board.length}, 100px)`,
          gridTemplateRows: `repeat(${board.length}, 100px)`,
          gap: "2px",
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