export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
export const TIME_LIMIT_SECONDS = 5 * 60;

// Mark each letter 'correct', 'present' or 'absent'. Repeated letters are only
// marked as many times as they appear in the answer.
export function checkGuess(answer, guess) {
  const result = Array(WORD_LENGTH).fill('absent');
  const remaining = answer.split('');

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      remaining[i] = null;
    }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;
    const at = remaining.indexOf(guess[i]);
    if (at !== -1) {
      result[i] = 'present';
      remaining[at] = null;
    }
  }
  return result;
}

// Points for one guess. Letters only score the first time they are found
// (a letter found as 'present' can still score again once it is 'correct').
export function scoreGuess(guess, result, guessNumber, found) {
  const correct = [...found.correct];
  const present = [...found.present];
  const multiplier = MAX_GUESSES + 1 - guessNumber;
  let points = 0;

  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guess[i];
    if (result[i] === 'correct' && !correct.includes(letter)) {
      points += multiplier * 20;
      correct.push(letter);
    } else if (result[i] === 'present' && !present.includes(letter) && !correct.includes(letter)) {
      points += multiplier * 5;
      present.push(letter);
    }
  }
  return { points, found: { correct, present } };
}

export function winBonus(guessNumber) {
  return (MAX_GUESSES - guessNumber) * 100;
}

export function timeBonus(elapsedSeconds) {
  return Math.max(TIME_LIMIT_SECONDS - Math.floor(elapsedSeconds), 0);
}

// Best color for each keyboard letter so far: correct > present > absent.
export function keyStates(guesses) {
  const rank = { absent: 1, present: 2, correct: 3 };
  const states = {};
  for (const { word, result } of guesses) {
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = word[i];
      if (!states[letter] || rank[result[i]] > rank[states[letter]]) {
        states[letter] = result[i];
      }
    }
  }
  return states;
}
