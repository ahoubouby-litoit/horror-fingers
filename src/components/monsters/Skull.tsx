export const Skull = () => (
  <svg width="84" height="96" viewBox="0 0 84 96" aria-hidden="true" focusable="false">
    <ellipse cx="42" cy="42" rx="34" ry="36" fill="#e8e0d0" />
    <ellipse cx="42" cy="42" rx="34" ry="36" fill="none" stroke="#b0a090" strokeWidth="1.5" />
    <rect x="20" y="64" width="44" height="24" rx="6" fill="#d8d0c0" />
    <ellipse cx="27" cy="44" rx="11" ry="12" fill="#0a0008" />
    <ellipse cx="57" cy="44" rx="11" ry="12" fill="#0a0008" />
    <ellipse cx="27" cy="44" rx="6" ry="8" fill="#ff0000" opacity="0.25" />
    <ellipse cx="57" cy="44" rx="6" ry="8" fill="#ff0000" opacity="0.25" />
    <path d="M38,58 L42,52 L46,58 Z" fill="#a09080" />
    <ellipse cx="42" cy="59" rx="5" ry="3" fill="#0a0008" />
    {[22, 30, 38, 46, 54, 62].map((x, i) => (
      <rect key={i} x={x} y="71" width="7" height="10" rx="2" fill={i % 2 === 0 ? '#e0d8c8' : '#c8c0b0'} />
    ))}
    <line x1="42" y1="68" x2="42" y2="88" stroke="#b0a090" strokeWidth="1.5" />
    <path d="M50,18 L55,28 L50,32" stroke="#b0a090" strokeWidth="1" fill="none" />
    <path d="M25,22 L28,34" stroke="#b0a090" strokeWidth="1" />
  </svg>
);
