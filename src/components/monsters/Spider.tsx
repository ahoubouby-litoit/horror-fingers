export const Spider = () => (
  <svg width="90" height="80" viewBox="0 0 90 80" aria-hidden="true" focusable="false">
    <line x1="45" y1="0" x2="45" y2="20" stroke="#888" strokeWidth="1" opacity="0.6" />
    <line x1="36" y1="38" x2="6"  y2="20" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <line x1="36" y1="40" x2="4"  y2="40" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <line x1="36" y1="42" x2="8"  y2="58" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <line x1="36" y1="44" x2="14" y2="66" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <line x1="54" y1="38" x2="84" y2="20" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <line x1="54" y1="40" x2="86" y2="40" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <line x1="54" y1="42" x2="82" y2="58" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <line x1="54" y1="44" x2="76" y2="66" stroke="#110018" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="45" cy="40" rx="20" ry="22" fill="#110018" />
    <ellipse cx="45" cy="35" rx="13" ry="13" fill="#1a0028" />
    <ellipse cx="45" cy="48" rx="8" ry="10" fill="#220033" />
    <path d="M41,44 L45,35 L49,44 Z" fill="#ff2200" opacity="0.6" />
    {[38, 42, 46, 50].map((x, i) => (
      <circle key={i} cx={x} cy={30} r="2.2" fill="#ff2200" />
    ))}
    {[40, 44, 48].map((x, i) => (
      <circle key={i} cx={x} cy={26} r="1.5" fill="#ff6600" />
    ))}
  </svg>
);
