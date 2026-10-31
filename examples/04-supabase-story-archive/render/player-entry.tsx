import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player, PlayerRef} from '@remotion/player';
import {DURATION, FPS, H, SupabaseArchive, W} from '../src/Video';

const ref = React.createRef<PlayerRef>();
(window as any).seek = (f: number) =>
  new Promise<void>((resolve) => {
    ref.current?.seekTo(f);
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
createRoot(document.getElementById('root')!).render(
  <Player ref={ref} component={SupabaseArchive} durationInFrames={DURATION} fps={FPS} compositionWidth={W} compositionHeight={H} style={{width: W, height: H}} acknowledgeRemotionLicense />,
);
