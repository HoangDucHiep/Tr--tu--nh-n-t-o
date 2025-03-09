import React from 'react';

const styles = {
  container: {
    border: "3px solid rgba(241, 241, 241, 0.38)",
    width: "100%",
    height: "90%",
  },
  header: {
    textAlign: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: "1rem",
  },
  label: {
    marginRight: "0.5rem",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-evenly",
    marginTop: "2rem",
  },
};

const Setting = ({
  isPlaying,
  currentMode,
  onModeChange,
  onNameInput,
  onStartGameClick,
  onNewGameClick,
  onChangeSize,
}) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Settings</h3>

      <div style={styles.row}>
        <p style={styles.label}>Game Mode: </p>
        <div style={styles.radioGroup}>
          <input
            type="radio"
            id="single"
            name="mode"
            value="PvC"
            disabled={isPlaying}
            checked={currentMode === "PvC"}
            onChange={onModeChange}
          />
          <label htmlFor="single" style={styles.label}>PvC</label>

          <input
            type="radio"
            id="multi"
            name="mode"
            value="PvP"
            disabled={isPlaying}
            checked={currentMode === "PvP"}
            onChange={onModeChange}
          />
          <label htmlFor="PvP">PvP</label>
        </div>
      </div>

      <div style={styles.row}>
        <p style={styles.label}>Size: </p>
        <select name="size" id="size" disabled={isPlaying} onChange={onChangeSize}>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
      </div>

      <div style={styles.row}>
        <label htmlFor="player1" style={styles.label}>
          {currentMode === "PvP" ? "Player 1" : "Player"}
        </label>
        <input
          type="text"
          id="player1"
          placeholder={currentMode === "PvP" ? "Player 1" : "Player"}
          onChange={onNameInput}
          disabled={isPlaying}
        />
      </div>

      {currentMode === "PvP" && (
        <div style={styles.row}>
          <label htmlFor="player2" style={styles.label}>Player 2</label>
          <input
            type="text"
            id="player2"
            placeholder="Player 2"
            onChange={onNameInput}
            disabled={isPlaying}
          />
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button onClick={onStartGameClick} disabled={isPlaying}>Start Game</button>
        <button onClick={onNewGameClick} disabled={!isPlaying}>New Game</button >
      </div>
    </div>
  );
};

export default Setting;