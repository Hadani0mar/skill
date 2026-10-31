import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, SupabaseArchive, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="SupabaseArchive" component={SupabaseArchive} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
