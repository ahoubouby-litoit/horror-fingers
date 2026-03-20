export const Mummy = () => (
  <svg width="80" height="100" viewBox="0 0 80 100" aria-hidden="true" focusable="false">
    <rect x="16" y="58" width="48" height="40" rx="8" fill="#c8b890" />
    {[60, 68, 76, 84, 90].map((y, i) => (
      <path key={y} d={`M16,${y} Q40,${y + (i % 2 === 0 ? -4 : 4)} 64,${y}`} stroke="#a89868" strokeWidth="3" fill="none" />
    ))}
    <path d="M16,62 L16,98 M64,62 L64,98" stroke="#a89868" strokeWidth="2" opacity="0.4" />
    <rect x="2"  y="60" width="16" height="10" rx="5" fill="#c8b890" transform="rotate(-8,10,65)" />
    <rect x="62" y="60" width="16" height="10" rx="5" fill="#c8b890" transform="rotate(8,70,65)" />
    <rect x="32" y="48" width="16" height="14" rx="4" fill="#c8b890" />
    <path d="M30,52 Q40,56 50,52" stroke="#a89868" strokeWidth="2" fill="none" />
    <ellipse cx="40" cy="30" rx="22" ry="24" fill="#c8b890" />
    {[18, 22, 26, 30, 36, 40, 44].map((y, i) => (
      <path key={y} d={`M${18 + i * 2},${y} Q40,${y + (i % 2 === 0 ? -3 : 3)} ${62 - i * 2},${y}`}
        stroke="#a89868" strokeWidth="2.5" fill="none" />
    ))}
    <ellipse cx="30" cy="26" rx="7" ry="8" fill="#a89868" />
    <ellipse cx="30" cy="26" rx="5" ry="6" fill="#0a0008" />
    <ellipse cx="30" cy="26" rx="3" ry="4" fill="#ff4400" opacity="0.9" />
    <circle  cx="31" cy="24" r="1.5" fill="white" opacity="0.7" />
    <ellipse cx="50" cy="28" rx="7" ry="5" fill="#b8a878" />
    <path d="M43,26 Q50,24 57,26" stroke="#a89868" strokeWidth="2" fill="none" />
    <path d="M43,28 Q50,32 57,28" stroke="#a89868" strokeWidth="2" fill="none" />
    <path d="M32,40 Q40,44 48,40" stroke="#7a6840" strokeWidth="2" fill="none" />
    <path d="M55,46 Q58,60 54,72" stroke="#c8b890" strokeWidth="4" fill="none" strokeLinecap="round"
      style={{ animation: 'spiderDangle 2s ease-in-out infinite' }} />
    <circle cx="24" cy="20" r="2"   fill="#a89868" opacity="0.6" />
    <circle cx="48" cy="16" r="1.5" fill="#a89868" opacity="0.6" />
  </svg>
);
