import React from 'react';
import icons from '../icons.json';

// Real illustrated UI icons: Microsoft Fluent UI System Icons "Color" (MIT) + Icons8 Flat Color (MIT) via Iconify icon-sets.
export type IconName = keyof typeof icons;

let counter = 0;
const prefixIds = (body: string, prefix: string) =>
  body
    .replace(/id="([^"]+)"/g, (_m, id) => `id="${prefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_m, id) => `url(#${prefix}${id})`)
    .replace(/href="#([^"]+)"/g, (_m, id) => `href="#${prefix}${id}"`);

export const Icon: React.FC<{name: IconName; size?: number; style?: React.CSSProperties}> = ({name, size = 96, style}) => {
  const icon = (icons as Record<string, {body: string; w: number; h: number}>)[name];
  const prefix = React.useMemo(() => `i${(counter++).toString(36)}_`, []);
  const html = React.useMemo(() => prefixIds(icon.body, prefix), [icon.body, prefix]);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${icon.w} ${icon.h}`}
      style={{display: 'block', flexShrink: 0, ...style}}
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
};
