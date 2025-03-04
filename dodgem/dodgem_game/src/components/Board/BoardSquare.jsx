import Square from "./Square";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../utils/Constants";

export default function BoardSquare({ x, y, onMove, isValid, children }) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      drop: (item) => {
        const { position } = item;
        if (position.x !== x || position.y !== y) {
          onMove(item.id, { x, y });
        }
      },
      canDrop: (item) => isValid(item.id, { x, y }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [x, y, onMove, isValid]
  );

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Square>{children}</Square>


      {isOver && !canDrop && <div
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
            height: "98%",
            width: "98%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "red",
          }}
        />}
      {!isOver && canDrop && <div
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
            height: "98%",
            width: "98%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />}
      {isOver && canDrop && <div
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
            height: "98%",
            width: "98%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "green",
          }}
        />}
    </div>
  );
}
