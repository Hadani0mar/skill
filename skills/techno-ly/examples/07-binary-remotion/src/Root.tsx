import React from 'react';
import {Composition} from 'remotion';
import {BinaryFilm} from './Video';
import timeline from './timeline.json';
export const Root:React.FC=()=> <Composition id="Binary" component={BinaryFilm} durationInFrames={timeline.totalFrames} width={1080} height={1920} fps={60}/>;
