import React from 'react'
import assets from './assets.json'
import { lin, eo, back, spring, clamp } from './anim'
// Icons: m0usasvg UI looks (outline / duotone / fill). Logos: m0usasvg brand files. Ids prefixed per instance.
let n = 0
const prefix = (b: string, p: string) => b.replace(/id="([^"]+)"/g, (_, i) => `id="${p}${i}"`)
  .replace(/url\(#([^)]+)\)/g, (_, i) => `url(#${p}${i})`).replace(/href="#([^"]+)"/g, (_, i) => `href="#${p}${i}"`)
export function Ico({ name, size = 16, color, look = 'outline', style }: { name: string; size?: number; color?: string; look?: 'outline' | 'duotone' | 'fill'; style?: React.CSSProperties }) {
  const p = React.useMemo(() => `m${(n++).toString(36)}_`, [])
  const raw = (assets.icons as any)[look][name]
  if (!raw) throw new Error('icon ' + name)
  const svg = prefix(raw, p).replace(/width="24" height="24"/, `width="${size}" height="${size}"`)
  return <span style={{ display: 'inline-flex', width: size, height: size, color, lineHeight: 0, flex: 'none', ...style }} dangerouslySetInnerHTML={{ __html: svg }} />
}
export function Logo({ k, h, style }: { k: 'sb' | 'sbword' | 'gh' | 'oai' | 'pg' | 'pgword' | 'tt' | 'ttword'; h: number; style?: React.CSSProperties }) {
  const p = React.useMemo(() => `l${(n++).toString(36)}_`, [])
  let raw = prefix((assets.logos as any)[k], p)
  raw = raw.replace(/\.([a-zA-Z][\w-]*)(?=[\s,{])/g, (m, c) => (/^\d/.test(c) ? m : `.${p}${c}`)).replace(/class="([^"]+)"/g, (_, c) => `class="${c.split(' ').map((x: string) => p + x).join(' ')}"`)
  raw = raw.replace(/ width="[^"]*"/, '').replace(/ height="[^"]*"/, '').replace(/<svg /, `<svg style="height:${h}px;width:auto;display:block" `)
  return <span style={{ display: 'inline-flex', lineHeight: 0, flex: 'none', ...style }} dangerouslySetInnerHTML={{ __html: raw }} />
}

// React Bits "BlurText" motion, frame-driven: words go from blur + offset to sharp, staggered.
export function BlurText({ t, at, text, step = 0.09, hl = [], className, style, dur = 0.45 }: { t: number; at: number; text: string; step?: number; hl?: string[]; className?: string; style?: React.CSSProperties; dur?: number }) {
  const words = text.split(' ')
  return (
    <div className={className} style={style} dir="rtl">
      {words.map((w, i) => {
        const p = eo(lin(t, at + i * step, at + i * step + dur))
        return <span key={i} className={hl.includes(w) ? 'hl' : undefined} style={{ display: 'inline-block', opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * -14}px)`, marginInlineEnd: '0.26em' }}>{w}</span>
      })}
    </div>
  )
}

// Pop-in wrapper (spring scale + fade), optional exit.
export function Pop({ t, at, out = 1e9, children, style, from = 0.6, y = 0, className }: { t: number; at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; y?: number; className?: string }) {
  const s = spring(t, at, 0.7)
  const o = clamp(lin(t, at, at + 0.15)) * (1 - lin(t, out, out + 0.25))
  if (o <= 0) return null
  const sc = from + (1 - from) * s
  return <div className={className} style={{ ...style, opacity: o, transform: `${style?.transform || ''} translateY(${(1 - s) * y}px) scale(${sc * (1 - 0.06 * lin(t, out, out + 0.25))})` }}>{children}</div>
}

// "Visual scan": a green beam passes over a box once at `at`.
export function Beam({ t, at, dur = 0.55 }: { t: number; at: number; dur?: number }) {
  const p = lin(t, at, at + dur)
  if (p <= 0 || p >= 1) return null
  return <div className="beam" style={{ top: `${eo(p) * 100}%`, opacity: Math.sin(p * Math.PI) }} />
}
export { back }
