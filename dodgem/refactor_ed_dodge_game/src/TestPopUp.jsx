import React from "react";
import Popup from "reactjs-popup";

import "./index.css";

export default function TestPopUp() {
  return (
    <Popup
      trigger={<button className="button"> Open Modal </button>}
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <div className="header"> Game Over </div>
          <div className="content">
            <h1>The winner is Player 1!!!</h1>
          </div>
          <div className="actions">
            <button
              className="popUp-close-btn"
              onClick={() => {
                console.log("modal closed ");
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
