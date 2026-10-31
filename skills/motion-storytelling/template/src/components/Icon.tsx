import React from 'react';
import icons from '../icons.json';
import {C} from '../theme';

// UI icons from m0usasvg (https://github.com/Hadani0mar/m0usasvg), "duotone" look, extracted from
// src/data/ui/looks/duotone.json. They use currentColor: colour them with the `color` prop. One look per video.
export type IconName = keyof typeof icons;

let counter = 0;
const prefixIds = (body: string, prefix: string) =>
  body
    .replace(/id="([^"]+)"/g, (_m, id) => `id="${prefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_m, id) => `url(#${prefix}${id})`)
    .replace(/href="#([^"]+)"/g, (_m, id) => `href="#${prefix}${id}"`);

export const Icon: React.FC<{name: IconName; size?: number; color?: string; style?: React.CSSProperties}> = ({name, size = 96, color = (C as any).appPrimary ?? C.ink, style}) => {
  const svg = (icons as Record<string, string>)[name];
  const prefix = React.useMemo(() => `i${(counter++).toString(36)}_`, []);
  const html = React.useMemo(
    () => prefixIds(svg, prefix).replace(/width="24" height="24"/, `width="${size}" height="${size}"`),
    [svg, prefix, size],
  );
  return <span style={{display: 'block', flexShrink: 0, lineHeight: 0, width: size, height: size, color, ...style}} dangerouslySetInnerHTML={{__html: html}} />;
};
