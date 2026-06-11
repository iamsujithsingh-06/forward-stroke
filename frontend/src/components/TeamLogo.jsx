import { useState } from 'react';
import { IPL_TEAMS } from '../data/iplTeams';

const uid = () => Math.random().toString(36).slice(2, 8);

export default function TeamLogo({ teamId, shortName, color, secondaryColor, logoUrl, size = 48 }) {
  const [imgError, setImgError] = useState(false);

  if (!teamId && !shortName) return null;

  const team = teamId ? IPL_TEAMS.find((t) => t.id === teamId) : null;
  const initials = shortName || team?.shortName || teamId.slice(0, 2).toUpperCase();
  const primary = color || team?.color || '#6366f1';
  const secondary = secondaryColor || team?.secondaryColor || '#ffffff';
  const url = logoUrl || team?.logoUrl;

  if (url && !imgError) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `2px solid ${secondary}`,
          backgroundColor: primary,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        role="img"
        aria-label={`${team?.name || initials} logo`}
      >
        <img
          src={url}
          alt=""
          style={{ width: '70%', height: '70%', objectFit: 'contain' }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const id = uid();
  const clipId = `t-clip-${id}`;
  const gradId = `t-grad-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${team?.name || initials} logo`}
      className="shrink-0"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill={primary} stroke={secondary} strokeWidth="2" />

      <g clipPath={`url(#${clipId})`}>
        <polygon
          points="32,6 50,18 50,40 32,56 14,40 14,18"
          fill={`url(#${gradId})`}
          opacity="0.3"
        />
        <polygon
          points="32,14 44,22 44,38 32,48 20,38 20,22"
          fill="none"
          stroke={secondary}
          strokeWidth="1"
          opacity="0.4"
        />
      </g>

      <circle cx="32" cy="32" r="18" fill={secondary} opacity="0.15" />

      <text
        x="32"
        y="36"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="18"
        fontWeight="800"
        fill={secondary}
      >
        {initials}
      </text>
    </svg>
  );
}
