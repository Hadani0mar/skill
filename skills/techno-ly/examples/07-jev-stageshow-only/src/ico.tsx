import React from 'react'
import assets from './assets.json'
let n = 0
const prefix = (b: string, p: string) => b.replace(/id="([^"]+)"/g, (_, i) => `id="${p}${i}"`).replace(/url\(#([^)]+)\)/g, (_, i) => `url(#${p}${i})`).replace(/href="#([^"]+)"/g, (_, i) => `href="#${p}${i}"`)
// m0usasvg UI icon (outline look) and brand logo, both inlined.
export function Ico({ name, size = 18, color }: { name: string; size?: number; color?: string }) {
  const p = React.useMemo(() => `m${(n++).toString(36)}_`, [])
  const raw = (assets.icons as any).outline[name]; if (!raw) throw new Error('icon ' + name)
  return <span style={{ display: 'inline-flex', width: size, height: size, color, lineHeight: 0, flex: 'none' }} dangerouslySetInnerHTML={{ __html: prefix(raw, p).replace(/width="24" height="24"/, `width="${size}" height="${size}"`) }} />
}
export function Logo({ k, h, color }: { k: string; h: number; color?: string }) {
  const p = React.useMemo(() => `l${(n++).toString(36)}_`, [])
  let raw = prefix((assets.logos as any)[k], p)
  raw = raw.replace(/\.([a-zA-Z][\w-]*)(?=[\s,{])/g, (m, c) => (/^\d/.test(c) ? m : `.${p}${c}`)).replace(/class="([^"]+)"/g, (_, c) => `class="${c.split(' ').map((x: string) => p + x).join(' ')}"`)
  raw = raw.replace(/ width="[^"]*"/, '').replace(/ height="[^"]*"/, '').replace(/<svg /, `<svg style="height:${h}px;width:auto;display:block" `)
  return <span style={{ display: 'inline-flex', lineHeight: 0, flex: 'none', color }} dangerouslySetInnerHTML={{ __html: raw }} />
}
