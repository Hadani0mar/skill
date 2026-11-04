import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import F from './film.json';

export const RemotionRoot: React.FC = () => (
  <Composition id="BrandFilm" component={Film} durationInFrames={Math.round(F.dur * F.fps)} fps={F.fps} width={F.size[0]} height={F.size[1]} />
);
