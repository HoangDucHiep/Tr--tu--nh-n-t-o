import React, {useState} from 'react';

const Setting = () => {
  const [mode, setMode] = useState('PvC');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleNameInput = (event) => {
    if (event.target.id === 'player1') {
      setPlayer1(event.target.value);
    } else {
      setPlayer2(event.target.value);
    }    
  }


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
            checked={mode === 'PvC'}
            onChange={handleModeChange}
          />
          <label htmlFor="single" style={{marginRight: "0.9rem"}}>PvC</label>

          <input
            type="radio"
            id="multi"
            name="mode"
            value="PvP"
            checked={mode === 'PvP'}
            onChange={handleModeChange}
          />
          <label htmlFor="PvP">PvP</label>
        </div>
      </div>

      <div>
        <label htmlFor="player1">{mode === 'PvP' ? "Player 1" : "Player"}</label>
        <input type="text" id="player1" placeholder='Enter name' onChange={handleNameInput} />
      </div>
      {mode === 'PvP' && (
        <div>
          <label htmlFor="player2">Player 2</label>
          <input type="text" id="player2" placeholder='Enter name' onChange={handleNameInput}/>
        </div>
      )}

      <button>Start Game</button>
      <button>New Game</button>
    </div>
  );
};

export default Setting;