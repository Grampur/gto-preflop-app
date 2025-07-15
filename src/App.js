import React, { useState } from 'react';

const GTO_DATA = {
  "EP RFI": ["77+", "A5s+", "AJo+", "KTs+", "KJo+", "QTs+", "QJo", "JTs"],
  "LJ RFI": ["55+", "A2s+", "A9o+", "K9s+", "KJo+", "Q9s+", "QJo", "J9s+", "JTo", "T8s+", "T9o", "98s"],
  "HJ RFI": ["22+", "A2s+", "A7o+", "K7s+", "KTo+", "Q8s+", "QTo+", "J8s+", "JTo", "T7s+", "T9o", "97s+", "98o", "87s", "86s+", "76s", "65s"],
  "CO RFI": ["22+", "A2s+", "A5o+", "K5s+", "K9o+", "Q6s+", "Q9o+", "J7s+", "J9o+", "T6s+", "T8o+", "96s+", "97o+", "85s+", "86o+", "75s+", "76o", "64s+", "65o", "54s"],
  "BU RFI": ["22+", "A2s+", "A2o+", "K2s+", "K7o+", "Q4s+", "Q8o+", "J5s+", "J8o+", "T5s+", "T7o+", "94s+", "96o+", "84s+", "85o+", "74s+", "75o+", "63s+", "64o+", "53s+", "54o", "43s"],
  "BU RFI v Fishy BB": ["22+", "A2s+", "A2o+", "K2s+", "K2o+", "Q2s+", "Q5o+", "J2s+", "J7o+", "T2s+", "T6o+", "92s+", "94o+", "82s+", "84o+", "72s+", "74o+", "62s+", "63o+", "52s+", "53o+", "42s+", "43o+", "32s+", "32o+"],
  "HJ Iso vs EP Limp": ["55+", "A2s+", "A8o+", "K8s+", "KJo+", "Q9s+", "QJo", "J9s+", "JTo", "T8s+", "T9o", "98s", "87s"],
  "BU Iso v CO Limp": ["22+", "A2s+", "A2o+", "K2s+", "K5o+", "Q4s+", "Q8o+", "J5s+", "J8o+", "T5s+", "T7o+", "94s+", "96o+", "84s+", "85o+", "74s+", "75o+", "63s+", "64o+", "53s+", "54o", "43s", "32s"]
};

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

function getHandAction(hand, position, gtoData) {
  const validHands = gtoData[position];
  const isMatch = validHands.some(entry => handMatches(entry, hand));
  return isMatch ? 'raise' : 'fold';
}

export default function App() {
  const [position, setPosition] = useState('EP RFI');

  // Generate the grid cells
  const renderGrid = () => {
    return RANKS.map(row => (
      <div key={row} style={{ display: 'flex' }}>
        {RANKS.map(col => {
          const isPair = row === col;
          const hand = isPair ? `${row}${col}` : `${row}${col}s`;
          const offSuitHand = `${row}${col}o`;
          
          let action;
          if (isPair) {
            action = getHandAction(`${row}${col}`, position, GTO_DATA);
          } else {
            // For non-pairs, check both suited and offsuit versions
            const suitedAction = getHandAction(`${row}${col}s`, position, GTO_DATA);
            const offSuitAction = getHandAction(`${row}${col}o`, position, GTO_DATA);
            action = { suited: suitedAction, offsuit: offSuitAction };
          }

          return (
            <div
              key={`${row}${col}`}
              style={{
                width: '60px',
                height: '60px',
                border: '1px solid #333',
                display: 'flex',
                position: 'relative',
              }}
            >
              {isPair ? (
                // Render pair cell
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: action === 'raise' ? '#4CAF50' : '#f44336',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}>
                  {hand}
                </div>
              ) : (
                // Render split cell for suited/offsuit
                <>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderStyle: 'solid',
                    borderWidth: '60px 60px 0 0',
                    borderColor: `${action.suited === 'raise' ? '#4CAF50' : '#f44336'} transparent transparent transparent`,
                    position: 'absolute',
                  }}/>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderStyle: 'solid',
                    borderWidth: '0 0 60px 60px',
                    borderColor: `transparent transparent ${action.offsuit === 'raise' ? '#4CAF50' : '#f44336'} transparent`,
                    position: 'absolute',
                  }}/>
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textShadow: '1px 1px 1px black',
                    fontSize: '14px',
                  }}>
                    {row}{col}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', padding: '2rem', color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>GTO Preflop Grid</h1>
      
      <div>
        <label>Position: </label>
        <select 
          value={position} 
          onChange={(e) => setPosition(e.target.value)}
          style={{ marginBottom: '1rem' }}
        >
          {Object.keys(GTO_DATA).map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '1px',
        backgroundColor: '#333',
        padding: '1px',
        width: 'fit-content'
      }}>
        {renderGrid()}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>Color Legend:</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#4CAF50', marginRight: '0.5rem' }}></div>
            <span>Raise</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#f44336', marginRight: '0.5rem' }}></div>
            <span>Fold</span>
          </div>
        </div>
      </div>
    </div>
  );
}