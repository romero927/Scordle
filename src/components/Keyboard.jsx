const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

export default function Keyboard({ states, onKey }) {
  return (
    <div id="keyboard">
      {ROWS.map((row, r) => (
        <div className="keyboard-row" key={r}>
          {row.map((key) => {
            const wide = key === 'Enter' || key === 'Backspace';
            const state = states[key];
            return (
              <button
                key={key}
                type="button"
                className={`key${wide ? ' wide' : ''}${state ? ` ${state}` : ''}`}
                aria-label={key === 'Backspace' ? 'Delete letter' : key === 'Enter' ? 'Submit guess' : key}
                onClick={(e) => {
                  onKey(key);
                  e.currentTarget.blur(); // so Enter on the physical keyboard doesn't re-click this button
                }}
              >
                {key === 'Backspace' ? 'back' : key.toLowerCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
