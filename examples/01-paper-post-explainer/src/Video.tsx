import React from 'react';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {iris} from '@remotion/transitions/iris';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {BrandChrome} from './components/Frame';
import {Narrator} from './components/Narrator';
import {Hook, Outro, Problem} from './scenes/Intro';
import {Agent, Bridge, Finance, Home, Inventory, Team} from './scenes/AppScenes';
import {END, SCENES, TRANSITION, W, H} from './theme';

const FontFaces: React.FC = () => {
  const weights: [string, number][] = [
    ['Light', 300],
    ['Regular', 400],
    ['Medium', 500],
    ['SemiBold', 600],
    ['Bold', 700],
  ];
  const css = weights
    .map(
      ([n, w]) =>
        `@font-face{font-family:'IBM Plex Sans Arabic';font-weight:${w};font-style:normal;font-display:block;src:url('${staticFile(
          `fonts/IBMPlexSansArabic-${n}.ttf`,
        )}') format('truetype');}`,
    )
    .join('\n');
  return <style>{css}</style>;
};

const COMPONENTS: Record<(typeof SCENES)[number]['id'], React.FC> = {
  hook: Hook,
  problem: Problem,
  bridge: Bridge,
  home: Home,
  inventory: Inventory,
  finance: Finance,
  agent: Agent,
  team: Team,
  outro: Outro,
};

export const AlMutamakkinExplainer: React.FC = () => {
  const {fps} = useVideoConfig();
  // Transition presentations vary per cut (RTL: new content enters from the left).
  const presentations = [
    slide({direction: 'from-left'}),
    wipe({direction: 'from-top-left'}),
    iris({width: W, height: H}),
    slide({direction: 'from-left'}),
    slide({direction: 'from-left'}),
    clockWipe({width: W, height: H}),
    wipe({direction: 'from-left'}),
    fade(),
  ];
  return (
    <AbsoluteFill style={{background: '#f3f2ee'}}>
      <FontFaces />
      <TransitionSeries>
        {SCENES.map((scene, i) => {
          const Comp = COMPONENTS[scene.id];
          const next = SCENES[i + 1];
          const dur = next ? Math.round((next.start - scene.start) * fps) + TRANSITION : Math.round((END - scene.start) * fps);
          return (
            <React.Fragment key={scene.id}>
              <TransitionSeries.Sequence name={scene.id} durationInFrames={dur}>
                <Comp />
              </TransitionSeries.Sequence>
              {next ? (
                <TransitionSeries.Transition
                  presentation={presentations[i] as never}
                  timing={i % 2 === 0 ? springTiming({config: {damping: 200}, durationInFrames: TRANSITION}) : linearTiming({durationInFrames: TRANSITION})}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      <BrandChrome />
      <Narrator />
    </AbsoluteFill>
  );
};
