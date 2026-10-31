import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, PrestoWorld, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="PrestoWorld" component={PrestoWorld} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
