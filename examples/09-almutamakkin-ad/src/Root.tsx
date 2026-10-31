import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, MutamakkinAd, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="MutamakkinAd" component={MutamakkinAd} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
