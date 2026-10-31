import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, SupabaseNewspaper, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="SupabaseNewspaper" component={SupabaseNewspaper} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
