import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import Board, { FLIP_STAGGER_MS } from './components/Board.jsx';
import Keyboard from './components/Keyboard.jsx';
import StatsModal from './components/StatsModal.jsx';
import RulesModal from './components/RulesModal.jsx';
import { gameReducer, newGameState } from './game/reducer.js';
import { TIME_LIMIT_SECONDS, keyStates } from './game/logic.js';
import { randomAnswer, isValidWord } from './game/words.js';
import { saveGame } from './game/history.js';

// Time for the last tile to finish flipping.
const REVEAL_MS = 4 * FLIP_STAGGER_MS + 500;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [game, dispatch] = useReducer(gameReducer, null, () => newGameState(randomAnswer(), Date.now()));
  const [now, setNow] = useState(() => Date.now());
  const [modal, setModal] = useState(null); // 'stats' | 'rules' | null
  const [shake, setShake] = useState(null); // { row, n } while a row is shaking
  const [revealedAt, setRevealedAt] = useState(null);
  const savedGameId = useRef(null);

  const playing = game.status === 'playing';
  const revealing = game.lastGuessAt !== null && revealedAt !== game.lastGuessAt;
  const elapsed = Math.floor(((playing ? now : game.endTime) - game.startTime) / 1000);
  const remaining = Math.max(TIME_LIMIT_SECONDS - elapsed, 0);

  // Tick the clock. Based on timestamps, so it stays accurate when the tab is in the background.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [playing, game.id]);

  useEffect(() => {
    if (playing && remaining <= 0) dispatch({ type: 'TIMEOUT', now: game.startTime + TIME_LIMIT_SECONDS * 1000 });
  }, [playing, remaining, game.startTime]);

  // While the newest row is flipping, hold back its keyboard colors and the game-over message.
  useEffect(() => {
    if (!game.lastGuessAt) return;
    const id = setTimeout(() => setRevealedAt(game.lastGuessAt), REVEAL_MS);
    return () => clearTimeout(id);
  }, [game.lastGuessAt]);

  // Save each finished game once.
  useEffect(() => {
    if (playing || savedGameId.current === game.id) return;
    savedGameId.current = game.id;
    saveGame({
      result: game.status === 'won' ? 'win' : 'loss',
      time: Math.min(Math.round((game.endTime - game.startTime) / 1000), TIME_LIMIT_SECONDS),
      guesses: game.guesses.length,
      score: game.score,
      date: new Date(game.endTime).toISOString(),
      correctWord: game.answer,
    });
  }, [playing, game]);

  const newGame = useCallback(() => {
    const t = Date.now();
    setNow(t);
    dispatch({ type: 'NEW_GAME', answer: randomAnswer(), now: t });
  }, []);

  const current = game.current;
  const guessCount = game.guesses.length;
  const handleKey = useCallback(
    (key) => {
      if (!playing) return;
      if (key === 'Enter') {
        if (current.length < 5 || !isValidWord(current)) {
          setShake((s) => ({ row: guessCount, n: (s?.n ?? 0) + 1 }));
        }
        dispatch({ type: 'SUBMIT', now: Date.now(), isValidWord });
      } else if (key === 'Backspace') {
        dispatch({ type: 'BACKSPACE' });
      } else if (/^[A-Z]$/.test(key)) {
        dispatch({ type: 'TYPE', letter: key });
      }
    },
    [playing, current, guessCount],
  );

  useEffect(() => {
    if (modal) return;
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || (e.repeat && e.key === 'Enter')) return;
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      if (key === 'Enter' || key === 'Backspace' || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKey(key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, modal]);

  const message = revealing && !playing ? { text: '', type: '' } : game.message;

  const closeModal = useCallback(() => setModal(null), []);
  const clearShake = useCallback(() => setShake(null), []);

  return (
    <>
      <div className="game-wrapper">
        <header>
          <h1>Scordle</h1>
          <div id="timer" className={playing && remaining <= 30 ? 'low' : undefined} aria-label="Time remaining">
            {formatTime(remaining)}
          </div>
          <div id="score">Score: {game.score}</div>
        </header>
        <div className="button-container">
          <button id="new-game-btn" type="button" onClick={(e) => { newGame(); e.currentTarget.blur(); }}>New Game</button>
          <button id="stats-button" type="button" onClick={() => setModal('stats')}>Stats</button>
          <button id="scoring-rules-btn" type="button" onClick={() => setModal('rules')}>Rules</button>
        </div>
        <Board guesses={game.guesses} current={game.current} shake={shake} onShakeEnd={clearShake} />
        <div id="message-area" className={message.type} role="status" aria-live="polite">
          {message.text}
        </div>
        <Keyboard states={keyStates(revealing ? game.guesses.slice(0, -1) : game.guesses)} onKey={handleKey} />
      </div>
      {modal === 'stats' && <StatsModal onClose={closeModal} />}
      {modal === 'rules' && <RulesModal onClose={closeModal} />}
    </>
  );
}
