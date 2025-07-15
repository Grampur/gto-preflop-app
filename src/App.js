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

const positions = Object.keys(GTO_DATA);

const RANK_ORDER = "23456789TJQKA";

function parseHand(hand) {
  // Example: 'AA', '76s', 'AJo'
  let rank1 = hand[0];
  let rank2 = hand[1];
  let suited = hand.includes('s');
  let offsuit = hand.includes('o');
  return { rank1, rank2, suited, offsuit };
}

function handMatches(pattern, actual) {
  if (pattern === actual) return true;

  const actualHand = parseHand(actual);

  if (pattern.endsWith('+')) {
    const base = pattern.slice(0, -1);
    const baseHand = parseHand(base);

    // Pocket pairs, e.g. "77+"
    if (baseHand.rank1 === baseHand.rank2) {
      if (actualHand.rank1 === actualHand.rank2) {
        return (
          RANK_ORDER.indexOf(actualHand.rank1) >= RANK_ORDER.indexOf(baseHand.rank1)
        );
      }
      return false;
    }

    // Non-pair combos e.g. "A5s+"
    if (actualHand.suited !== baseHand.suited) return false;
    if (actualHand.rank1 !== baseHand.rank1) return false;

    return (
      RANK_ORDER.indexOf(actualHand.rank2) >= RANK_ORDER.indexOf(baseHand.rank2)
    );
  }

  return false;
}

export default function App() {
  const [position, setPosition] = useState('EP RFI');
  const [hand, setHand] = useState('');
  const [action, setAction] = useState('');

  const checkAction = () => {
    const validHands = GTO_DATA[position];
    const isMatch = validHands.some(entry => handMatches(entry, hand));
    setAction(isMatch ? 'Raise' : 'Fold');
  };

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', padding: '2rem', color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>GTO Preflop Lookup</h1>

      <div>
        <label>Position:</label>
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          {positions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Hand (e.g., AKo, 76s):</label>
        <input
          value={hand}
          onChange={(e) => setHand(e.target.value.toUpperCase())}
          placeholder="e.g. AA, AKo, 76s"
        />
      </div>

      <button style={{ marginTop: '1rem' }} onClick={checkAction}>Check GTO Action</button>

      {action && (
        <div style={{ marginTop: '1rem', fontSize: '1.25rem' }}>
          Action: <span style={{ color: action === 'Raise' ? 'lightgreen' : 'red' }}>{action}</span>
        </div>
      )}
    </div>
  );
}
