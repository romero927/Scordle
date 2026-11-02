import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

const KEY = 'scordle.theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function stored() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#121213' : '#f0f2f5');
}

// Follows the system setting until the player picks a theme.
export function useTheme() {
  const [theme, setTheme] = useState(() => stored() ?? (media().matches ? 'dark' : 'light'));

  useLayoutEffect(() => apply(theme), [theme]);

  useEffect(() => {
    if (stored()) return;
    const mq = media();
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}
