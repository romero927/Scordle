const KEY = 'scordle.gameHistory';

// The Django version kept history in a cookie. Move it into localStorage once.
function migrateCookie() {
  const match = document.cookie.match(/(?:^|;\s*)gameHistory=([^;]*)/);
  if (!match) return [];
  document.cookie = 'gameHistory=; path=/; max-age=0';
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return [];
  }
}

export function loadHistory() {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    history = [];
  }
  const migrated = migrateCookie();
  if (migrated.length) {
    history = [...migrated, ...history];
    write(history);
  }
  return history;
}

export function saveGame(game) {
  const history = loadHistory();
  history.push(game);
  write(history);
}

// Storage can be blocked (some private browsing modes); the game still works without it.
function write(history) {
  try {
    localStorage.setItem(KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function summarize(history) {
  const games = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  let wins = 0, totalScore = 0, totalTime = 0, winGuesses = 0, bestScore = 0;
  let best = null, worst = null;

  for (const g of games) {
    if (g.result === 'win') {
      wins++;
      winGuesses += g.guesses;
    }
    totalScore += g.score;
    bestScore = Math.max(bestScore, g.score);
    totalTime += g.time;
    if (!best || g.score > best.score || (g.score === best.score && g.time < best.time)) best = g;
    if (!worst || g.score < worst.score || (g.score === worst.score && g.time > worst.time)) worst = g;
  }

  const total = games.length;
  return {
    games,
    best,
    worst,
    total,
    wins,
    losses: total - wins,
    winRate: total ? (wins / total).toFixed(2) : 'N/A',
    avgScore: total ? Math.round(totalScore / total) : 0,
    avgTime: total ? Math.round(totalTime / total) : 0,
    avgGuesses: wins ? (winGuesses / wins).toFixed(1) : 'N/A',
    bestScore,
  };
}
