import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, LiveUI, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="LiveUI" component={LiveUI} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
