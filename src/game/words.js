import answerText from '../words/answer_word_list.txt?raw';
import validText from '../words/valid_word_list.txt?raw';

const parse = (text) =>
  text.split(/\r?\n/).map((w) => w.trim().toUpperCase()).filter(Boolean);

const ANSWERS = parse(answerText);
const VALID = new Set([...parse(validText), ...ANSWERS]);

export function randomAnswer() {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
}

export function isValidWord(word) {
  return VALID.has(word.toUpperCase());
}
