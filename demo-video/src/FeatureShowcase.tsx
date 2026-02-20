import React from 'react';
import { Easing } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { ShowcaseHeroScene } from './scenes/ShowcaseHeroScene';
import { Feature1Scene } from './scenes/Feature1Scene';
import { Feature2Scene } from './scenes/Feature2Scene';
import { Feature3Scene } from './scenes/Feature3Scene';
import { OutroScene } from './scenes/OutroScene';

// Scene durations (in frames at 30fps)
const HERO_DURATION = 120; // 4s
const FEATURE1_DURATION = 300; // 10s
const FEATURE2_DURATION = 270; // 9s
const FEATURE3_DURATION = 270; // 9s
const OUTRO_DURATION = 120; // 4s

// Transition durations
const FADE_DURATION = 15;
const SLIDE_DURATION = 20;

export const FeatureShowcase: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Hero */}
      <TransitionSeries.Sequence durationInFrames={HERO_DURATION}>
        <ShowcaseHeroScene />
      </TransitionSeries.Sequence>

      {/* Fade: Hero -> Feature 1 */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_DURATION })}
      />

      {/* Feature 1: WUT Hover */}
      <TransitionSeries.Sequence durationInFrames={FEATURE1_DURATION}>
        <Feature1Scene />
      </TransitionSeries.Sequence>

      {/* Slide: Feature 1 -> Feature 2 */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={linearTiming({
          durationInFrames: SLIDE_DURATION,
          easing: Easing.inOut(Easing.cubic),
        })}
      />

      {/* Feature 2: AI Fallback */}
      <TransitionSeries.Sequence durationInFrames={FEATURE2_DURATION}>
        <Feature2Scene />
      </TransitionSeries.Sequence>

      {/* Slide: Feature 2 -> Feature 3 */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={linearTiming({
          durationInFrames: SLIDE_DURATION,
          easing: Easing.inOut(Easing.cubic),
        })}
      />

      {/* Feature 3: Settings Walkthrough */}
      <TransitionSeries.Sequence durationInFrames={FEATURE3_DURATION}>
        <Feature3Scene />
      </TransitionSeries.Sequence>

      {/* Fade: Feature 3 -> Outro */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_DURATION })}
      />

      {/* Outro */}
      <TransitionSeries.Sequence durationInFrames={OUTRO_DURATION}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
