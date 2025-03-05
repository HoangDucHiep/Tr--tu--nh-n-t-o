import React from "react";
import Popup from "reactjs-popup";



export default function PopUp({open, title, content, onClick}) {
  return (
    <Popup
      open={open}
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <div className="header"> {title} </div>
          <div className="content">
            <h1>{content}</h1>
          </div>
          <div className="actions">
            <button
              className="popUp-close-btn"
              onClick={() => {
                onClick();
                close();
              }}
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}
// Compare this snippet from dodgem/refactor_ed_dodge_game/src/utils/Constants.js:
