import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, RolesTale, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="RolesTale" component={RolesTale} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
