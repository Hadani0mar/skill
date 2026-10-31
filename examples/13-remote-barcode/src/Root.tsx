import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DURATION, FPS, H, BarcodeRemote, W} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="BarcodeRemote" component={BarcodeRemote} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
registerRoot(RemotionRoot);
