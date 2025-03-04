

const Setting = ({isPlaying, currentMode, onModeChange, onNameInput, onNewGameClick}) => {
  return (
    <div
      style={{
        border: "3px solid rgba(241, 241, 241, 0.38)",
        width: "300px",

      }}
    >
      <h3>Settings</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}>
        <p style={{marginRight: "0.5rem"}}>Game Mode: </p>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <input
            type="radio"
            id="single"
            name="mode"
            value="PvC"
            disabled={isPlaying}
            checked={currentMode === 'PvC'}
            onChange={onModeChange}
          />
          <label htmlFor="single" style={{marginRight: "0.9rem"}}>PvC</label>

          <input
            type="radio"
            id="multi"
            name="mode"
            value="PvP"
            disabled={isPlaying}
            checked={currentMode === 'PvP'}
            onChange={onModeChange}
          />
          <label htmlFor="PvP">PvP</label>
        </div>
      </div>

      <div>
        <label htmlFor="player1">{currentMode === 'PvP' ? "Player 1" : "Player"}</label>
        <input type="text" id="player1" placeholder='Enter name' onChange={onNameInput} disabled={isPlaying}/>
      </div>
      {currentMode === 'PvP' && (
        <div>
          <label htmlFor="player2">Player 2</label>
          <input type="text" id="player2" placeholder='Enter name' onChange={onNameInput} disabled={isPlaying}/>
        </div>
      )}

      <button onClick={onNewGameClick}>Start Game</button>
      <button>New Game</button>
    </div>
  );
};

export default Setting;