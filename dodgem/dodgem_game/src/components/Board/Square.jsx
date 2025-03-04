const Square = ({children}) => {
  return (
    <div
      className="square"
      style={{
        border: "5px solid rgba(241, 241, 241, 0.03)",
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
