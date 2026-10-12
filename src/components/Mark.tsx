/** App mark: three answer rows, the middle one bubbled in. */
export function Mark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="5" fill="var(--pencil)" />
      <circle cx="7" cy="7" r="2" fill="none" stroke="var(--paper)" strokeWidth="1.3" opacity="0.6" />
      <circle cx="7" cy="12" r="2.3" fill="var(--ok)" />
      <circle cx="7" cy="17" r="2" fill="none" stroke="var(--paper)" strokeWidth="1.3" opacity="0.6" />
      <rect x="11" y="6" width="8" height="2" rx="1" fill="var(--paper)" opacity="0.6" />
      <rect x="11" y="11" width="9" height="2" rx="1" fill="var(--paper)" />
      <rect x="11" y="16" width="7" height="2" rx="1" fill="var(--paper)" opacity="0.6" />
    </svg>
  );
}
