import React from 'react';
import {Composition} from 'remotion';
import {ArenaAgentsVideo, VIDEO_META} from './Video';

export const Root: React.FC = () => <Composition id="ArenaAgents" component={ArenaAgentsVideo} durationInFrames={VIDEO_META.durationInFrames} fps={VIDEO_META.fps} width={VIDEO_META.width} height={VIDEO_META.height}/>;
