import Tile from "./Tile";
import SquareMask from "./SquareMask";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../utils/Constants";

export default function BoardTile({
  x,
  y,
  onMove,
  isValid,
  isDestination,
  isDimmed,
  children,
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      drop: (item) => {
        const { position } = item;
        if (position.x !== x || position.y !== y) {
          onMove(item.id, { x, y });
        }
      },
      canDrop: (item) => isValid(item.id, x, y),
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
        backgroundColor: isDimmed
          ? "rgba(255, 0, 0, 0)"
          : "rgba(255, 255, 255, 0)",
      }}
    >
      <Tile>{children}</Tile>

      {isDestination && <SquareMask color="rgba(102, 255, 117, 0.29)" />}

      {isOver && !canDrop && <SquareMask color="rgba(255, 0, 0, 0.86)" />}
      {!isOver && canDrop && <SquareMask color="rgba(238, 255, 0, 0.82)" />}
      {isOver && canDrop && <SquareMask color="rgba(0, 255, 26, 0.8)" />}
    </div>
  );
}
