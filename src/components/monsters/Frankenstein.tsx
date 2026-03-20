export const Frankenstein = () => (
  <svg width="84" height="102" viewBox="0 0 84 102" aria-hidden="true" focusable="false">
    <rect x="4"  y="52" width="12" height="8" rx="3" fill="#aab0a0" />
    <rect x="68" y="52" width="12" height="8" rx="3" fill="#aab0a0" />
    <rect x="16" y="62" width="52" height="38" rx="6" fill="#3a5530" />
    <polygon points="30,62 42,72 30,84" fill="#2a4020" />
    <polygon points="54,62 42,72 54,84" fill="#2a4020" />
    <rect x="30" y="50" width="24" height="18" rx="4" fill="#5a8050" />
    <circle cx="10" cy="56" r="3" fill="#334428" />
    <circle cx="74" cy="56" r="3" fill="#334428" />
    <rect x="12" y="12" width="60" height="46" rx="10" fill="#6a9060" />
    <rect x="12" y="10" width="60" height="14" rx="5"  fill="#5a8050" />
    <path d="M18,22 L22,16 M22,16 L26,22" stroke="#3a5530" strokeWidth="2" />
    <path d="M38,22 L42,16 M42,16 L46,22" stroke="#3a5530" strokeWidth="2" />
    <path d="M24,38 L60,38" stroke="#3a5530" strokeWidth="1.5" strokeDasharray="4 3" />
    <ellipse cx="29" cy="30" rx="8" ry="8" fill="#1a0808" />
    <ellipse cx="55" cy="30" rx="8" ry="8" fill="#1a0808" />
    <ellipse cx="29" cy="30" rx="4" ry="5" fill="#aaff44" opacity="0.9" />
    <ellipse cx="55" cy="30" rx="4" ry="5" fill="#aaff44" opacity="0.9" />
    <circle cx="30" cy="28" r="2" fill="#0a0005" />
    <circle cx="56" cy="28" r="2" fill="#0a0005" />
    <rect x="22" y="21" width="14" height="5" rx="2" fill="#1a2810" />
    <rect x="48" y="21" width="14" height="5" rx="2" fill="#1a2810" />
    <rect x="38" y="34" width="8" height="6" rx="2" fill="#5a7a48" />
    <path d="M24,46 L60,46" stroke="#2a4020" strokeWidth="3" fill="none" strokeLinecap="round" />
    {[30, 36, 42, 48, 54].map((x) => (
      <line key={x} x1={x} y1="46" x2={x} y2="52" stroke="#2a4020" strokeWidth="2.5" />
    ))}
    <path d="M18,36 Q22,32 26,36 Q30,32 34,36" stroke="#4a6838" strokeWidth="1.5" fill="none" />
  </svg>
);
