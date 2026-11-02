import Modal from './Modal.jsx';
import { loadHistory, summarize } from '../game/history.js';

export default function StatsModal({ onClose }) {
  const s = summarize(loadHistory());
  const stat = (label, value) => (
    <div className="stat-item">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );

  return (
    <Modal title="Game Statistics" onClose={onClose}>
      <div id="stats-container">
        <div className="stats-summary">
          <div className="stats-row">
            {stat('Total Games', s.total)}
            {stat('Wins', s.wins)}
            {stat('Losses', s.losses)}
          </div>
          <div className="stats-row">
            {stat('Win Rate', s.winRate)}
            {stat('Avg Score', s.avgScore)}
            {stat('Avg Time', `${s.avgTime}s`)}
          </div>
          <div className="stats-row">
            {stat('Best Score', s.bestScore)}
            {stat('Avg Guesses', s.avgGuesses)}
          </div>
        </div>
        <h3>Game History</h3>
        {s.total > 0 && <p className="table-note">Score shows letters + win bonus + time bonus.</p>}
        {s.total === 0 ? (
          <p>No games played yet.</p>
        ) : (
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Result</th>
                  <th>Time (s)</th>
                  <th>Guesses</th>
                  <th>Score</th>
                  <th>Correct Word</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {s.games.map((g, i) => {
                  const date = new Date(g.date);
                  const cls = g === s.best ? 'best-game' : g === s.worst ? 'worst-game' : undefined;
                  return (
                    <tr key={`${g.date}-${i}`} className={cls}>
                      <td>{g.result === 'win' ? 'Win' : 'Loss'}</td>
                      <td>{g.time}</td>
                      <td>{g.guesses}</td>
                      <td>
                        {g.score}
                        {g.letters !== undefined && (
                          <span
                            className="score-detail"
                            title={`Letters ${g.letters}, win bonus ${g.winBonus}, time bonus ${g.timeBonus}`}
                          >
                            {g.letters} + {g.winBonus} + {g.timeBonus}
                          </span>
                        )}
                      </td>
                      <td>{g.correctWord}</td>
                      <td>{date.toLocaleDateString()} {date.toLocaleTimeString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}
