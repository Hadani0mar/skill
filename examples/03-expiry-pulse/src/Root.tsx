import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, ExpiryPulse, FPS, H, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="ExpiryPulse" component={ExpiryPulse} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
