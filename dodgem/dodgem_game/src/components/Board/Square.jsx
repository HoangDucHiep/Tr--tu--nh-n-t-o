const Square = ({children}) => {
  return (
    <div
      className="square"
      style={{
        backgroundColor: "rgba(202, 202, 202, 0.67)",
        border: "5px solid rgb(37, 37, 37)",
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >{children}</div>
  );
};

export default Square;
