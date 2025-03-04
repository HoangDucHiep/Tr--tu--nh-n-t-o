const SquareMask = ({ color }) => {
  return (
    <div
          style={{
            position: "absolute",
            top: "5.5px",
            left: "5.5px",
            height: "98.5%",
            width: "98.5%",
            zIndex: 1,
            opacity: 0.3,
            backgroundColor: color,
          }}
        />
  )
}

export default SquareMask;