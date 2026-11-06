import type { SVGProps } from 'react';

/** Ikon garis 24×24. Sebagian bentuk umum mengikuti gaya Lucide (lisensi ISC). */
const paths = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h5v-6h4v6h5V9.5" /></>,
  quran: <><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z" /><path d="M12 6.5v13" /><path d="m7 21 5-1.5 5 1.5" /></>,
  rehal: <><path d="M4 7c3-.5 6 0 8 1.5C14 7 17 6.5 20 7" /><path d="M4 7v6c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V7" /><path d="m6 21 12-7M18 21 6 14" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  mosque: <><path d="M2 21h20" /><path d="M6.5 21v-7.5h11V21" /><path d="M7 13.5a5 5 0 0 1 10 0" /><path d="M12 8.5V6.2" /><path d="M12.9 4.6a1.2 1.2 0 1 1-1.4-1.5 1 1 0 0 0 1.4 1.5Z" /><path d="M10.5 21v-2.8a1.5 1.5 0 0 1 3 0V21" /><path d="M3.5 21V11l1-1.6 1 1.6v10M18.5 21V11l1-1.6 1 1.6v10" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  kaaba: <><path d="M12 3 4 6.5v11L12 21l8-3.5v-11z" /><path d="m4 6.5 8 3.5 8-3.5M12 10v11" /><path d="m4 9.5 8 3.5 8-3.5" /><path d="M15 14.5v3.4" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="M15.3 13.2a2 2 0 1 0 1.5 2.9 1.6 1.6 0 0 1-1.5-2.9Z" /></>,
  hands: <><path d="M11 20.5H8.4a3 3 0 0 1-2.3-1.1L3.6 16.3A1.3 1.3 0 0 1 5.6 14.6l1.6 1.6V7.5a1.3 1.3 0 0 1 2.6 0V12l.2-6.2a1.3 1.3 0 0 1 2.6 0" /><path d="M13 20.5h2.6a3 3 0 0 0 2.3-1.1l2.5-3.1a1.3 1.3 0 0 0-2-1.7l-1.6 1.6V7.5a1.3 1.3 0 0 0-2.6 0V12" /><path d="M12 5.8V20.5" /></>,
  beads: <><circle cx="12" cy="3.8" r="1.4" /><circle cx="16.4" cy="5.4" r="1.4" /><circle cx="18.4" cy="9.6" r="1.4" /><circle cx="16.4" cy="13.8" r="1.4" /><circle cx="7.6" cy="5.4" r="1.4" /><circle cx="5.6" cy="9.6" r="1.4" /><circle cx="7.6" cy="13.8" r="1.4" /><circle cx="12" cy="15.4" r="1.4" /><path d="M12 16.8v2.4m0 0-1.8 2.3m1.8-2.3 1.8 2.3" /></>,
  sunrise: <><path d="M12 3v3M4.9 7.9l1.4 1.4M19.1 7.9l-1.4 1.4M2 17h2M20 17h2" /><path d="M7 17a5 5 0 0 1 10 0" /><path d="M2 21h20" /></>,
  sunset: <><path d="M12 9V3m0 6-2.5-2.5M12 9l2.5-2.5" /><path d="M2 17h2M20 17h2M4.9 11.9l1.4 1.4M19.1 11.9l-1.4 1.4" /><path d="M7 17a5 5 0 0 1 10 0" /><path d="M2 21h20" /></>,
  star8: <><path d="M6.5 6.5h11v11h-11z" /><path d="m12 4.2 7.8 7.8-7.8 7.8L4.2 12z" /><circle cx="12" cy="12" r="2" /></>,
  crescent: <><path d="M16.5 4.2A8.5 8.5 0 1 0 19.8 15a7 7 0 0 1-3.3-10.8Z" /><path d="m18 6.5.5 1.4 1.4.1-1.1.9.4 1.4-1.2-.8-1.2.8.4-1.4-1.1-.9 1.4-.1z" /></>,
  lantern: <><path d="M12 2v2" /><path d="M9.5 4h5l1.5 3h-8z" /><path d="M8 7h8v9.5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" /><path d="M10 18.5 12 22l2-3.5" /><path d="M12 10v5M10 12.5h4" /></>,
  scroll: <><path d="M8 21h10a2 2 0 0 0 2-2v-1H10v1a2 2 0 1 1-4 0V5a2 2 0 0 0-2-2" /><path d="M18 18V5a2 2 0 0 0-2-2H4a2 2 0 0 1 2 2" /><path d="M10 8h6M10 12h6" /></>,
  sparkle: <><path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" /><path d="M19 15.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3Z" /></>,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14a6.5 6.5 0 0 1 3 6" /></>,
  headphones: <><path d="M3.5 18v-6a8.5 8.5 0 0 1 17 0v6" /><path d="M20.5 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3.5 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-3z" /></>,
  cap: <><path d="M22 9 12 4 2 9l10 5z" /><path d="M6 11.2V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.8" /><path d="M22 9v6" /></>,
  calculator: <><rect x="4.5" y="2.5" width="15" height="19" rx="2.5" /><path d="M8 6.5h8v3H8z" /><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" /></>,
  notebook: <><rect x="4.5" y="3" width="15" height="18" rx="2.5" /><path d="M8.5 3v18" /><path d="m11.5 11 1.7 1.7 3.3-3.4" /><path d="M11.5 16h5" /></>,
  heartHand: <><path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" /><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 15 6 6" /><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.7 2.7 0 0 0 16.6 4a2.8 2.8 0 0 0-4.4 1.9c0 1.1.8 1.9 1.6 2.7L16.6 11z" /></>,
  brain: <><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M12 5v13" /></>,
  steps: <><circle cx="12" cy="4.5" r="2" /><path d="M12 7.5v6M8 10.5h8M9.5 21l2.5-7.5 2.5 7.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
  bookmark: <path d="M18 21 12 17 6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />,
  bookmarkFill: <path d="M18 21 12 17 6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" fill="currentColor" />,
  heart: <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />,
  heartFill: <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" fill="currentColor" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20.5 20.5-4.5-4.5" /></>,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowLeft: <path d="M19 12H5m6 6-6-6 6-6" />,
  play: <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" fill="currentColor" />,
  pause: <><rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" /><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" /></>,
  next: <><path d="M5 5.5v13a1 1 0 0 0 1.6.8l8.5-6.5a1 1 0 0 0 0-1.6L6.6 4.7A1 1 0 0 0 5 5.5Z" fill="currentColor" /><path d="M19 5v14" /></>,
  prev: <><path d="M19 5.5v13a1 1 0 0 1-1.6.8l-8.5-6.5a1 1 0 0 1 0-1.6l8.5-6.5A1 1 0 0 1 19 5.5Z" fill="currentColor" /><path d="M5 5v14" /></>,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />,
  volume: <><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></>,
  repeat: <><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  locate: <><circle cx="12" cy="12" r="3.5" /><circle cx="12" cy="12" r="8" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  bellOff: <><path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20" /></>,
  copy: <><rect x="8.5" y="8.5" width="12.5" height="12.5" rx="2" /><path d="M5 15.5H4.5A1.5 1.5 0 0 1 3 14V4.5A1.5 1.5 0 0 1 4.5 3H14a1.5 1.5 0 0 1 1.5 1.5V5" /></>,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 13.3 7.6 4.4M15.8 6.3l-7.6 4.4" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M3 6h18M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" /><path d="M5.5 6 6.5 20a1.5 1.5 0 0 0 1.5 1.4h8a1.5 1.5 0 0 0 1.5-1.4L18.5 6" /></>,
  refresh: <><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 21v-5h5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4.5M12 8h.01" /></>,
  alert: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.6 6.6 0 0 0 10.7 10.7Z" />,
  monitor: <><rect x="2.5" y="3.5" width="19" height="13" rx="2" /><path d="M8 21h8M12 16.5V21" /></>,
  external: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5.5" /></>,
  github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>,
  instagram: <><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><path d="M17.5 6.5h.01" /></>,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  mail: <><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6.5 9 6.5 9-6.5" /></>,
  type: <><path d="M4 7V4.5h16V7M9 20h6M12 4.5V20" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  quote: <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></>,
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  list: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />,
  layers: <><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></>,
  wallet: <><path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4h-12A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" /><path d="M3 6.5A2.5 2.5 0 0 0 5.5 9H20v6h-4a3 3 0 0 1 0-6" /></>,
  coins: <><circle cx="9" cy="9" r="6" /><path d="M18.1 10.4A6 6 0 1 1 10.4 18.1M7 6h2v4M16.7 13.9l.7.7-2.8 2.8" /></>,
  wheat: <><path d="M2 22 16 8" /><path d="M3.5 12.5 5 11l1.5 1.5a3.5 3.5 0 0 1 0 5L5 19l-1.5-1.5a3.5 3.5 0 0 1 0-5ZM7.5 8.5 9 7l1.5 1.5a3.5 3.5 0 0 1 0 5L9 15l-1.5-1.5a3.5 3.5 0 0 1 0-5ZM11.5 4.5 13 3l1.5 1.5a3.5 3.5 0 0 1 0 5L13 11l-1.5-1.5a3.5 3.5 0 0 1 0-5Z" /><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" /></>,
  gem: <><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3 8 9l4 13 4-13-3-6M2 9h20" /></>,
  droplet: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  map: <><path d="M14.1 5.6 9.9 3.4a2 2 0 0 0-1.8 0L3.6 5.7A1 1 0 0 0 3 6.6v12.6a1 1 0 0 0 1.4.9l3.7-1.9a2 2 0 0 1 1.8 0l4.2 2.2a2 2 0 0 0 1.8 0l4.5-2.3a1 1 0 0 0 .6-.9V4.8a1 1 0 0 0-1.4-.9l-3.7 1.9a2 2 0 0 1-1.8 0Z" /><path d="M15 5.8v15M9 3.2v15" /></>,
  dice: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" /></>,
  trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16" /><path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8" /><path d="M18 2H6v7a6 6 0 0 0 12 0z" /></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M4 21h16" /></>,
  filter: <path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" />,
  fullscreen: <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />,
} as const;

export type IconName = keyof typeof paths;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function Icon({ name, size = 20, strokeWidth = 1.75, label, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? `icon ${className}` : 'icon'}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
