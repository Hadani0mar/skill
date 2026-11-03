import React from 'react'
import { lin, eo, spring, clamp } from './anim'
// «تقني» lettermark: the letter ت — a bowl and two pixel dots (reads as a smiling face).
// d1/d2: drop progress of the dots (spring), bowl: stroke draw progress 0..1.
export function Mark({ size, t, at, bg = '#1f9d63', ink = '#fff', dot2 = '#0b3d26', circle = true }: { size: number; t: number; at: number; bg?: string; ink?: string; dot2?: string; circle?: boolean }) {
  const d1 = spring(t, at, 0.6), d2 = spring(t, at + 0.1, 0.6)
  const bowl = eo(lin(t, at + 0.2, at + 0.6))
  const bg_ = spring(t, at - 0.15, 0.6)
  return (
    <svg viewBox="0 0 1080 1080" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      {circle && <circle cx="540" cy="540" r={540 * clamp(bg_ * 1.02, 0, 1.02)} fill={bg} />}
      <g transform="translate(0 45)">
        <path d="M300 470 C300 700 780 700 780 440" fill="none" stroke={ink} strokeWidth="118" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - bowl} opacity={bowl > 0 ? 1 : 0} />
        <rect x="400" y={300 - (1 - d1) * 420} width="112" height="112" rx="22" fill={ink} opacity={clamp(d1 * 3)} />
        <rect x="568" y={300 - (1 - d2) * 420} width="112" height="112" rx="22" fill={dot2} opacity={clamp(d2 * 3)} />
      </g>
    </svg>
  )
}
