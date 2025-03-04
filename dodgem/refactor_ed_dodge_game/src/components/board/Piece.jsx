import { ItemTypes } from "../../utils/Constants";
import { useDrag } from "react-dnd";

const Piece = ({ color, position, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { id, position }, // Truyền id và position để xác định quân cờ
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      className="piece"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: color,
      }}
    />
  );
};

export default Piece;