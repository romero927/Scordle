import { WORD_LENGTH, MAX_GUESSES } from '../game/logic.js';

export const FLIP_STAGGER_MS = 300;

export default function Board({ guesses, current, shake, onShakeEnd, celebrate }) {
  const rows = [];
  for (let r = 0; r < MAX_GUESSES; r++) {
    const guess = guesses[r];
    const isCurrent = r === guesses.length;
    const letters = guess ? guess.word : isCurrent ? current : '';
    const winRow = celebrate && r === guesses.length - 1;

    const tiles = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = letters[i] || '';
      let className = 'letter-box';
      if (guess) className += ` revealed ${guess.result[i]}`;
      else if (letter) className += ' filled';
      tiles.push(
        <div
          key={i}
          className={className}
          style={guess ? { animationDelay: `${i * (winRow ? 100 : FLIP_STAGGER_MS)}ms` } : undefined}
        >
          {letter}
        </div>,
      );
    }

    const shaking = shake?.row === r;
    rows.push(
      <div
        // A new key restarts the shake animation on repeated invalid guesses.
        key={shaking ? `row-${r}-shake-${shake.n}` : `row-${r}`}
        className={`word-row${shaking ? ' shake' : ''}${winRow ? ' win' : ''}`}
        onAnimationEnd={(e) => shaking && e.target === e.currentTarget && onShakeEnd()}
        aria-label={`Row ${r + 1}${guess ? `: ${guess.word}, ${guess.result.join(', ')}` : ''}`}
      >
        {tiles}
      </div>,
    );
  }
  return <div id="game-board">{rows}</div>;
}
