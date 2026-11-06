export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className="logo-mark">
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d6b52" />
          <stop offset="1" stopColor="#0b3a2c" />
        </linearGradient>
      </defs>
      <path
        d="M8 8h32v32H8zM24 1.4 46.6 24 24 46.6 1.4 24z"
        fill="url(#lm-g)"
        stroke="#d4af61"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8 8h32v32H8z" fill="none" stroke="#d4af61" strokeWidth="0.8" opacity="0.55" />
      <path d="M26.6 11.4a5.6 5.6 0 1 0 3 7.8 4.5 4.5 0 1 1-3-7.8Z" fill="#e7c77e" />
      <path
        d="M13.5 31c3.6-1.6 7.3-1.3 10.5.9 3.2-2.2 6.9-2.5 10.5-.9v-7.6c-3.6-1.6-7.3-1.3-10.5.9-3.2-2.2-6.9-2.5-10.5-.9z"
        fill="#fbf6e9"
      />
      <path d="M24 24.3v7.6" stroke="#0b3a2c" strokeWidth="0.9" />
      <path d="m17 35.5 14-3.8M31 35.5l-14-3.8" stroke="#e7c77e" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-text">
        Ma<b>R</b>ilmu
      </span>
    </span>
  );
}
