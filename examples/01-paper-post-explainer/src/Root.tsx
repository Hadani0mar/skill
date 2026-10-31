import React from 'react';
import {Composition} from 'remotion';
import {AlMutamakkinExplainer} from './Video';
import {END, FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="AlMutamakkinExplainer" component={AlMutamakkinExplainer} durationInFrames={END * FPS} fps={FPS} width={W} height={H} />
);
