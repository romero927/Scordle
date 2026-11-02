import { describe, it, expect } from 'vitest';
import { checkGuess, scoreGuess, winBonus, timeBonus, keyStates } from './logic.js';
import { gameReducer, newGameState } from './reducer.js';

describe('checkGuess', () => {
  it('marks exact, misplaced and missing letters', () => {
    expect(checkGuess('CRANE', 'CARTS')).toEqual(['correct', 'present', 'present', 'absent', 'absent']);
  });
  it('does not over-count repeated letters', () => {
    expect(checkGuess('ABBEY', 'BABES')).toEqual(['present', 'present', 'correct', 'correct', 'absent']);
    expect(checkGuess('CIGAR', 'LLAMA')).toEqual(['absent', 'absent', 'present', 'absent', 'absent']);
    expect(checkGuess('SPEED', 'EERIE')).toEqual(['present', 'present', 'absent', 'absent', 'absent']);
  });
});

describe('scoring', () => {
  it('only scores letters the first time', () => {
    const first = scoreGuess('CARTS', checkGuess('CRANE', 'CARTS'), 1, { correct: [], present: [] });
    expect(first.points).toBe(6 * 20 + 6 * 5 * 2);
    const again = scoreGuess('CARTS', checkGuess('CRANE', 'CARTS'), 2, first.found);
    expect(again.points).toBe(0);
  });
  it('bonuses', () => {
    expect(winBonus(1)).toBe(500);
    expect(winBonus(6)).toBe(0);
    expect(timeBonus(0)).toBe(300);
    expect(timeBonus(61.9)).toBe(239);
    expect(timeBonus(400)).toBe(0);
  });
  it('keyboard keeps the best state', () => {
    const s = keyStates([
      { word: 'CARTS', result: ['correct', 'present', 'present', 'absent', 'absent'] },
      { word: 'RACES', result: ['absent', 'absent', 'correct', 'absent', 'absent'] },
    ]);
    expect(s.R).toBe('present');
    expect(s.C).toBe('correct');
    expect(s.T).toBe('absent');
  });
});

describe('reducer', () => {
  const valid = () => true;
  const typeWord = (state, word) =>
    [...word].reduce((s, letter) => gameReducer(s, { type: 'TYPE', letter }), state);

  it('wins with bonuses', () => {
    let s = newGameState('CRANE', 0);
    s = typeWord(s, 'CRANE');
    s = gameReducer(s, { type: 'SUBMIT', now: 10_000, isValidWord: valid });
    expect(s.status).toBe('won');
    expect(s.score).toBe(5 * 120 + 500 + 290);
    expect(s.guesses).toHaveLength(1);
  });

  it('loses after six wrong guesses and ignores input after', () => {
    let s = newGameState('CRANE', 0);
    for (let i = 0; i < 6; i++) {
      s = typeWord(s, 'MOULD');
      s = gameReducer(s, { type: 'SUBMIT', now: 1000, isValidWord: valid });
    }
    expect(s.status).toBe('lost');
    expect(s.message.text).toContain('CRANE');
    expect(typeWord(s, 'A')).toBe(s);
  });

  it('rejects short and unknown words without using a guess', () => {
    let s = typeWord(newGameState('CRANE', 0), 'CRA');
    s = gameReducer(s, { type: 'SUBMIT', now: 0, isValidWord: valid });
    expect(s.message.text).toBe('Not enough letters');
    s = typeWord(s, 'XX');
    expect(s.message.text).toBe('');
    s = gameReducer(s, { type: 'SUBMIT', now: 0, isValidWord: () => false });
    expect(s.message.text).toBe('Not in word list');
    expect(s.guesses).toHaveLength(0);
  });

  it('caps input at five letters', () => {
    expect(typeWord(newGameState('CRANE', 0), 'ABCDEFG').current).toBe('ABCDE');
  });

  it('times out', () => {
    const s = gameReducer(newGameState('CRANE', 0), { type: 'TIMEOUT', now: 300_000 });
    expect(s.status).toBe('lost');
    expect(s.message.text).toBe("Time's up! The word was CRANE");
  });
});
