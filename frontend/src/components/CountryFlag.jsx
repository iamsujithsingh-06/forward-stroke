import { useState } from 'react';

const FALLBACKS = {
  IN: () => (
    <g>
      <rect width="64" height="16" fill="#FF9933" />
      <rect y="16" width="64" height="16" fill="#FFFFFF" />
      <rect y="32" width="64" height="16" fill="#138808" />
      <circle cx="32" cy="24" r="5.5" fill="none" stroke="#000080" strokeWidth="1.2" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <line key={i} x1="32" y1="24" x2={32 + Math.cos((i * Math.PI) / 6) * 5.5} y2={24 + Math.sin((i * Math.PI) / 6) * 5.5} stroke="#000080" strokeWidth="0.6" />
      ))}
    </g>
  ),
  AU: () => (
    <g>
      <rect width="64" height="48" fill="#00008B" />
      <rect width="18" height="13.5" fill="#FFFFFF" />
      <rect x="9" width="1.2" height="13.5" fill="#00008B" />
      <rect y="6.75" width="18" height="1.2" fill="#00008B" />
      <rect x="4.5" y="3.37" width="4.5" height="1.2" fill="#00008B" />
      <rect x="4.5" y="10.12" width="1.2" height="3.38" fill="#00008B" />
      <line x1="0" y1="0" x2="18" y2="13.5" stroke="#00008B" strokeWidth="1.2" />
      <line x1="18" y1="0" x2="0" y2="13.5" stroke="#00008B" strokeWidth="1.2" />
      {[{ x: 37, y: 33 }, { x: 45, y: 25 }, { x: 50, y: 37 }, { x: 56, y: 29 }, { x: 42, y: 15 }].map((p, i) => (
        <polygon key={i} points={`${p.x},${p.y - 4} ${p.x + 1.2},${p.y - 1} ${p.x + 4},${p.y - 1} ${p.x + 1.8},${p.y + 1.2} ${p.x + 2.5},${p.y + 4} ${p.x},${p.y + 2.2} ${p.x - 2.5},${p.y + 4} ${p.x - 1.8},${p.y + 1.2} ${p.x - 4},${p.y - 1} ${p.x - 1.2},${p.y - 1}`} fill="#FFFFFF" />
      ))}
    </g>
  ),
  GB: () => (
    <g>
      <rect width="64" height="48" fill="#FFFFFF" />
      <rect x="29" width="6" height="48" fill="#CE1124" />
      <rect y="20" width="64" height="8" fill="#CE1124" />
    </g>
  ),
  PK: () => (
    <g>
      <rect width="16" height="48" fill="#FFFFFF" />
      <rect x="16" width="48" height="48" fill="#01411C" />
      <circle cx="40" cy="19" r="8" fill="#FFFFFF" />
      <circle cx="44" cy="18" r="6.5" fill="#01411C" />
      <polygon points="37,28 39,32 43,31.5 39,34 42,38 37,36 35,40 34,36 30,38 33,34 29,31.5 33,32" fill="#FFFFFF" />
    </g>
  ),
  NZ: () => (
    <g>
      <rect width="64" height="48" fill="#00247D" />
      <rect width="18" height="13.5" fill="#FFFFFF" />
      <rect x="9" width="1.2" height="13.5" fill="#00247D" />
      <rect y="6.75" width="18" height="1.2" fill="#00247D" />
      <rect x="4.5" y="3.37" width="4.5" height="1.2" fill="#00247D" />
      <rect x="4.5" y="10.12" width="1.2" height="3.38" fill="#00247D" />
      <line x1="0" y1="0" x2="18" y2="13.5" stroke="#00247D" strokeWidth="1.2" />
      <line x1="18" y1="0" x2="0" y2="13.5" stroke="#00247D" strokeWidth="1.2" />
      {[{ x: 42, y: 12 }, { x: 53, y: 22 }, { x: 47, y: 32 }, { x: 57, y: 34 }].map((p, i) => (
        <polygon key={i} points={`${p.x},${p.y - 5} ${p.x + 1.5},${p.y - 1.5} ${p.x + 5},${p.y - 1.5} ${p.x + 2.2},${p.y + 1.5} ${p.x + 3},${p.y + 5} ${p.x},${p.y + 2.5} ${p.x - 3},${p.y + 5} ${p.x - 2.2},${p.y + 1.5} ${p.x - 5},${p.y - 1.5} ${p.x - 1.5},${p.y - 1.5}`} fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.6" />
      ))}
    </g>
  ),
  ZA: () => (
    <g>
      <rect width="64" height="48" fill="#DE3831" />
      <rect y="16" width="64" height="16" fill="#FFFFFF" />
      <rect y="18" width="64" height="12" fill="#007A4D" />
      <polygon points="0,0 22,24 0,48" fill="#000000" />
      <polygon points="0,0 18,24 0,48" fill="#FFB612" />
      <polygon points="0,22 18,24 0,26" fill="#FFFFFF" />
      <polygon points="0,0 3,24 0,48" fill="#FFFFFF" />
    </g>
  ),
  LK: () => (
    <g>
      <rect x="2" y="2" width="60" height="44" rx="2" fill="#FFBE00" />
      <rect x="4" y="4" width="44" height="40" fill="#8D153A" />
      <rect x="50" y="4" width="6" height="40" fill="#005B3C" />
      <rect x="58" y="4" width="6" height="40" fill="#FF6600" />
      <rect x="48" y="4" width="2" height="40" fill="#FFBE00" />
      <ellipse cx="26" cy="22" rx="8" ry="6" fill="#FFBE00" />
      <path d="M22,30 L30,30 L26,40 Z" fill="#FFBE00" />
      <rect x="23" y="30" width="6" height="2" fill="#FFBE00" />
      <rect x="24" y="26" width="4" height="5" fill="#FFBE00" rx="1" />
    </g>
  ),
  AF: () => (
    <g>
      <rect width="21.3" height="48" fill="#000000" />
      <rect x="21.3" width="21.3" height="48" fill="#D32027" />
      <rect x="42.6" width="21.3" height="48" fill="#007A36" />
      <circle cx="32" cy="24" r="7" fill="#FFFFFF" />
      <rect x="29" y="22" width="6" height="4" fill="#000000" rx="1" />
      <rect x="31" y="20" width="2" height="8" fill="#000000" rx="1" />
      <path d="M28,26 Q32,20 36,26" fill="none" stroke="#000000" strokeWidth="1" />
      <rect x="30.5" y="24" width="3" height="3" fill="#000000" rx="0.5" />
    </g>
  ),
  BD: () => (
    <g>
      <rect width="64" height="48" fill="#006A4E" />
      <circle cx="27" cy="24" r="14.5" fill="#F42A41" />
    </g>
  ),
  IE: () => (
    <g>
      <rect width="21.3" height="48" fill="#169B62" />
      <rect x="21.3" width="21.3" height="48" fill="#FFFFFF" />
      <rect x="42.6" width="21.3" height="48" fill="#FF883E" />
    </g>
  ),
  WI: () => (
    <g>
      <rect width="64" height="48" fill="#8B0000" />
      <rect y="18" width="64" height="2" fill="#FCD116" />
      <rect y="20" width="64" height="10" fill="#000000" />
      <rect y="30" width="64" height="2" fill="#FCD116" />
    </g>
  ),
};

const LABELS = {
  IN: 'India',
  AU: 'Australia',
  GB: 'England',
  PK: 'Pakistan',
  NZ: 'New Zealand',
  ZA: 'South Africa',
  LK: 'Sri Lanka',
  AF: 'Afghanistan',
  BD: 'Bangladesh',
  IE: 'Ireland',
  WI: 'West Indies',
};

function SvgFallback({ code, w, h }) {
  const renderer = FALLBACKS[code];
  if (!renderer) return null;
  return (
    <svg width={w} height={h} viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Flag of ${LABELS[code] || code}`} className="shrink-0">
      {renderer()}
    </svg>
  );
}

function Skeleton({ w, h }) {
  return (
    <div
      className="animate-pulse rounded-sm bg-surface-200 dark:bg-surface-700 shrink-0"
      style={{ width: w, height: h }}
      aria-hidden="true"
    />
  );
}

export default function CountryFlag({ code, flagUrl, size = 48 }) {
  const uc = code ? code.toUpperCase() : '';
  const hasFallback = !!FALLBACKS[uc];
  const h = size;
  const w = Math.round(size * 1.333);

  if (!flagUrl || !hasFallback) {
    return <SvgFallback code={uc} w={w} h={h} />;
  }

  return <FlagImage flagUrl={flagUrl} code={uc} label={LABELS[uc] || uc} w={w} h={h} />;
}

function FlagImage({ flagUrl, code, label, w, h }) {
  const [status, setStatus] = useState('loading');

  if (status === 'error') {
    return <SvgFallback code={code} w={w} h={h} />;
  }

  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      {status === 'loading' && <Skeleton w={w} h={h} />}
      <img
        src={flagUrl}
        alt={`Flag of ${label}`}
        width={w}
        height={h}
        className={`shrink-0 object-cover rounded-sm ${status === 'loading' ? 'invisible absolute inset-0' : ''}`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}
