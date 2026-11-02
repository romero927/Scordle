import Modal from './Modal.jsx';

export default function RulesModal({ onClose }) {
  return (
    <Modal title="Scoring Rules" onClose={onClose}>
      <div id="scoring-rules-content">
        <p>Guess the 5-letter word in 6 tries before the 5-minute timer runs out. The clock starts when you type your first letter. Scoring works like this:</p>
        <ul>
          <li>Correct letter in correct position: (7 - current guess number) × 20 points (only the first time each letter is placed correctly)</li>
          <li>Correct letter in wrong position: (7 - current guess number) × 5 points (only the first time each letter is found)</li>
          <li>Win bonus: (6 - number of guesses) × 100 points</li>
          <li>Time bonus: up to 300 points for solving quickly</li>
        </ul>
        <p>The earlier you guess correctly and the faster you solve, the more points you earn!</p>
        <p>Win bonus examples:</p>
        <ul>
          <li>Correct on 1st try: 500 points</li>
          <li>Correct on 2nd try: 400 points</li>
          <li>Correct on 3rd try: 300 points</li>
          <li>Correct on 4th try: 200 points</li>
          <li>Correct on 5th try: 100 points</li>
          <li>Correct on 6th try: 0 points (but you still win!)</li>
        </ul>
        <p>The time bonus is 300 minus the number of seconds you took, so it starts at 300 and drops by 1 point every second until it reaches 0 at 5 minutes.</p>
      </div>
    </Modal>
  );
}
