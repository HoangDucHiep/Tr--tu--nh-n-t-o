const SquareMask = ({ color }) => {
  return (
    <div
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            height: "90%",
            width: "90%",
            zIndex: 1,
            opacity: 0.3,
            backgroundColor: color,
          }}
        />
  )
}

export default SquareMask;