// Offline render harness: mounts the real composition in Remotion's <Player> (built from source)
// and exposes seek() so Playwright can capture each frame. Locally you can use `npx remotion render` instead.
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player, PlayerRef} from '@remotion/player';
import {AlMutamakkinExplainer} from '../src/Video';
import {END, FPS, H, W} from '../src/theme';

const ref = React.createRef<PlayerRef>();
(window as any).seek = (f: number) =>
  new Promise<void>((resolve) => {
    ref.current?.seekTo(f);
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
(window as any).total = END * FPS;

createRoot(document.getElementById('root')!).render(
  <Player
    ref={ref}
    component={AlMutamakkinExplainer}
    durationInFrames={END * FPS}
    fps={FPS}
    compositionWidth={W}
    compositionHeight={H}
    style={{width: W, height: H}}
    acknowledgeRemotionLicense
  />,
);
