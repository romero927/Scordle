import { useEffect, useRef, useState } from 'react';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animates a number toward `target`. Drops straight to lower values (e.g. a new game).
export function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (target <= from || reducedMotion()) {
      fromRef.current = target;
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    let id;
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      const v = Math.round(from + (target - from) * eased);
      fromRef.current = v;
      setValue(v);
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);

  return value;
}
