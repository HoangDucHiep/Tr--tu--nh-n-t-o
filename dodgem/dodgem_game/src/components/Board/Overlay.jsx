export default function Overlay({color}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "5px",
        left: "5px",
        height: "98%",
        width: "98%",
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: {color},
      }}
    />
  );
};
