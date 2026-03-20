export const Ghost = () => (
  <svg width="88" height="100" viewBox="0 0 88 100" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="ghostGrad" cx="50%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#e8eeff" />
        <stop offset="100%" stopColor="#9aa8ff" stopOpacity="0.85" />
      </radialGradient>
    </defs>
    <path
      d="M8,55 Q6,12 44,8 Q82,12 80,55 L80,94 Q70,84 60,94 Q52,84 44,94 Q36,84 28,94 Q18,84 8,94 Z"
      fill="url(#ghostGrad)"
      stroke="#8899ff"
      strokeWidth="1.5"
      opacity="0.95"
    />
    <ellipse cx="30" cy="44" rx="9" ry="11" fill="#180025" />
    <ellipse cx="58" cy="44" rx="9" ry="11" fill="#180025" />
    <ellipse cx="30" cy="44" rx="5" ry="7" fill="#ff1133" />
    <ellipse cx="58" cy="44" rx="5" ry="7" fill="#ff1133" />
    <circle cx="32" cy="41" r="2.5" fill="white" opacity="0.9" />
    <circle cx="60" cy="41" r="2.5" fill="white" opacity="0.9" />
    <path d="M30,62 Q37,74 44,68 Q51,74 58,62" stroke="#180025" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <ellipse cx="44" cy="20" rx="3" ry="5" fill="#c8d0ff" opacity="0.4" />
  </svg>
);
