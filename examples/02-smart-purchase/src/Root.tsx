import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, SmartPurchaseTyper, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="SmartPurchaseTyper" component={SmartPurchaseTyper} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
