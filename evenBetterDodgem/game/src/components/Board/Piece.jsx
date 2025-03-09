import { ItemTypes } from "../../utils/Constants";
import { useDrag } from "react-dnd";

const Piece = ({ modelPiece, canDrag }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { id: modelPiece.id, x: modelPiece.x, y: modelPiece.y }, // Truyền id và position để xác định quân cờ
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: canDrag,
  }));

  return (
    <div
      className="piece"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: modelPiece.color,
        display: modelPiece.reachedDestination ? "none" : "block",
      }}
    />
  );
};

export default Piece;
