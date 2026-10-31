import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, AnthropicIPO, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="AnthropicIPO" component={AnthropicIPO} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
