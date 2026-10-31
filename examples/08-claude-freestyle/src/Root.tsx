import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, Freestyle, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="Freestyle" component={Freestyle} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
