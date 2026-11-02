import {
  WORD_LENGTH, MAX_GUESSES, checkGuess, scoreGuess, winBonus, timeBonus,
} from './logic.js';

export function newGameState(answer, now) {
  return {
    id: now,
    answer,
    guesses: [],
    current: '',
    status: 'playing', // 'playing' | 'won' | 'lost'
    score: 0,
    lastPoints: 0, // points from the latest guess, including bonuses
    breakdown: { letters: 0, win: 0, time: 0 },
    found: { correct: [], present: [] },
    startTime: null, // the clock starts on the first letter typed
    endTime: null,
    lastGuessAt: null,
    message: { text: '', type: '' },
  };
}

// isValidWord is passed in so the reducer stays easy to test.
export function gameReducer(state, action) {
  switch (action.type) {
    case 'NEW_GAME':
      return newGameState(action.answer, action.now);

    case 'TYPE':
      if (state.status !== 'playing' || state.current.length >= WORD_LENGTH) return state;
      return {
        ...state,
        current: state.current + action.letter,
        startTime: state.startTime ?? action.now,
        message: clearError(state.message),
      };

    case 'BACKSPACE':
      if (state.status !== 'playing' || !state.current) return state;
      return { ...state, current: state.current.slice(0, -1), message: clearError(state.message) };

    case 'SUBMIT':
      return submit(state, action);

    case 'TIMEOUT':
      if (state.status !== 'playing' || state.startTime === null) return state;
      return {
        ...state,
        status: 'lost',
        endTime: action.now,
        message: { text: `Time's up! The word was ${state.answer}`, type: 'error' },
      };

    default:
      return state;
  }
}

// Typing clears "Not in word list" style errors.
function clearError(message) {
  return message.type === 'error' ? { text: '', type: '' } : message;
}

function submit(state, { now, isValidWord }) {
  if (state.status !== 'playing') return state;

  const guess = state.current;
  if (guess.length !== WORD_LENGTH) {
    return { ...state, message: { text: 'Not enough letters', type: 'error' } };
  }
  if (!isValidWord(guess)) {
    return { ...state, message: { text: 'Not in word list', type: 'error' } };
  }

  const guessNumber = state.guesses.length + 1;
  const result = checkGuess(state.answer, guess);
  const { points, found } = scoreGuess(guess, result, guessNumber, state.found);
  const guesses = [...state.guesses, { word: guess, result }];
  const won = guess === state.answer;
  const lost = !won && guessNumber === MAX_GUESSES;

  const breakdown = { ...state.breakdown, letters: state.breakdown.letters + points };
  let message = { text: '', type: '' };

  if (won) {
    breakdown.win = winBonus(guessNumber);
    breakdown.time = timeBonus((now - state.startTime) / 1000);
    const tries = guessNumber === 1 ? '1 guess' : `${guessNumber} guesses`;
    message = { text: `You got it in ${tries}!`, type: 'success' };
  } else if (lost) {
    message = { text: `Game over! The word was ${state.answer}`, type: 'error' };
  }

  return {
    ...state,
    guesses,
    current: '',
    found,
    score: breakdown.letters + breakdown.win + breakdown.time,
    lastPoints: breakdown.letters + breakdown.win + breakdown.time - state.score,
    breakdown,
    status: won ? 'won' : lost ? 'lost' : 'playing',
    endTime: won || lost ? now : null,
    lastGuessAt: now,
    message,
  };
}
