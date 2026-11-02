// End-of-game score breakdown. Items appear one after another.
export default function Breakdown({ breakdown, total }) {
  const items = [
    { label: 'Letters', value: breakdown.letters },
    { label: 'Win bonus', value: breakdown.win },
    { label: 'Time bonus', value: breakdown.time },
    { label: 'Total', value: total, total: true },
  ];
  return (
    <ul className="breakdown" aria-label="Score breakdown">
      {items.map((item, i) => (
        <li
          key={item.label}
          className={item.total ? 'total' : item.value === 0 ? 'zero' : undefined}
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <span className="label">{item.label}</span>
          <span className="value">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
