import React from 'react'
import { lin, eo, clamp } from './anim'
// Frame-driven ports of React Bits pieces (react-bits/src/content): DecryptedText, Counter, ClickSpark, StarBorder.

// DecryptedText — characters scramble, then lock in left→right (sequential reveal).
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>'
const rnd = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x) }
export function Decrypted({ t, at, text, dur = 0.7, className, style }: { t: number; at: number; text: string; dur?: number; className?: string; style?: React.CSSProperties }) {
  if (t < at) return <span className={className} style={{ ...style, opacity: 0 }}>{text}</span>
  const p = lin(t, at, at + dur), f = Math.floor(t * 30)
  const out = text.split('').map((ch, i) => (ch === ' ' || i < Math.floor(p * text.length) ? ch : GLYPHS[Math.floor(rnd(i * 7.3 + f) * GLYPHS.length)]))
  return <span className={className} style={style}>{out.map((c, i) => <span key={i} style={{ color: i < Math.floor(p * text.length) || p >= 1 ? undefined : '#1f9d63', opacity: i < Math.floor(p * text.length) || p >= 1 ? 1 : 0.75 }}>{c}</span>)}</span>
}

// Counter — rolling digit columns (each place rolls to its digit).
export function Counter({ value, size, color = '#fff', weight = 900 }: { value: number; size: number; color?: string; weight?: number }) {
  const places = Math.max(1, Math.floor(Math.abs(value)).toString().length)
  return (
    <span style={{ display: 'inline-flex', direction: 'ltr', height: size, overflow: 'hidden', fontFamily: 'Inter', fontWeight: weight, fontSize: size, lineHeight: `${size}px`, color, fontVariantNumeric: 'tabular-nums' }}>
      {Array.from({ length: places }).map((_, k) => {
        const pl = Math.pow(10, places - 1 - k)
        const v = (value / pl) % 10
        return (
          <span key={k} style={{ position: 'relative', width: '0.62em', height: size }}>
            {Array.from({ length: 10 }).map((__, d) => {
              let off = (10 + d - v) % 10; if (off > 5) off -= 10
              return <span key={d} style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', transform: `translateY(${off * size}px)` }}>{d}</span>
            })}
          </span>
        )
      })}
    </span>
  )
}

// ClickSpark — star sparks burst radially from a point and fade (ease-out, slight drop).
export function Sparks({ t, at, x, y, count = 10, radius = 70, size = 14, color = '#22c55e', dur = 0.55 }: { t: number; at: number; x: number; y: number; count?: number; radius?: number; size?: number; color?: string; dur?: number }) {
  const p = lin(t, at, at + dur)
  if (p <= 0 || p >= 1) return null
  const e = eo(p)
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width="1" height="1">
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + rnd(i) * 0.3, reach = 0.75 + rnd(i + 3) * 0.45
        const d = radius * reach * e, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d + p * p * 18
        const s = size * (1 - p) * (0.7 + rnd(i + 9) * 0.5), r = s / 2, pin = r * 0.16
        const pts = [0, 1, 2, 3].map((k) => { const ang = a + k * Math.PI / 2; return [px + Math.cos(ang) * r, py + Math.sin(ang) * r] })
        const dPath = `M${pts[0]} Q${px} ${py} ${pts[1]} Q${px} ${py} ${pts[2]} Q${px} ${py} ${pts[3]} Q${px} ${py} ${pts[0]}Z`
        return <path key={i} d={dPath} fill={i % 3 === 0 ? '#111' : color} opacity={1 - p * 0.6} stroke={i % 3 === 0 ? '#111' : color} strokeWidth={pin} />
      })}
    </svg>
  )
}

// StarBorder — a light travelling around a rounded border (conic mask), frame-driven.
export function StarBorder({ t, children, radius = 999, color = '#22c55e', speed = 0.9, style, className }: { t: number; children: React.ReactNode; radius?: number; color?: string; speed?: number; style?: React.CSSProperties; className?: string }) {
  const ang = ((t * speed) % 1) * 360
  return (
    <span className={className} style={{ position: 'relative', display: 'inline-flex', borderRadius: radius, padding: 3, background: `conic-gradient(from ${ang}deg, transparent 0deg, transparent 250deg, ${color} 320deg, #fff 345deg, ${color} 355deg, transparent 360deg), #e6e6e6`, boxShadow: `0 10px 30px rgba(34,197,94,.25)`, ...style }}>
      {children}
    </span>
  )
}
export { clamp }
