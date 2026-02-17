import React from 'react';
import { Easing } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { TitleScene } from './scenes/TitleScene';
import { DetectionScene } from './scenes/DetectionScene';
import { AiFallbackScene } from './scenes/AiFallbackScene';
import { OutroScene } from './scenes/OutroScene';

// Scene durations (in frames at 30fps)
const TITLE_DURATION = 100; // ~3.3s (extra hold before first transition)
const DETECTION_DURATION = 240; // 8s (includes 1s post-transition hold)
const AI_FALLBACK_DURATION = 240; // 8s (includes 1s post-transition hold)
const OUTRO_DURATION = 180; // 6s (includes 1s post-transition hold)

// Transition durations
const FADE_DURATION = 15;
const SCROLL_DURATION = 25; // ~0.83s vertical push between Detection and AI Fallback

export const Video: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Title */}
      <TransitionSeries.Sequence durationInFrames={TITLE_DURATION}>
        <TitleScene />
      </TransitionSeries.Sequence>

      {/* Fade: Title -> Detection */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_DURATION })}
      />

      {/* Scenes 2+3: Detection + WUT Tooltip (combined) */}
      <TransitionSeries.Sequence durationInFrames={DETECTION_DURATION}>
        <DetectionScene />
      </TransitionSeries.Sequence>

      {/* Scroll: Detection -> AI Fallback (vertical push) */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={linearTiming({
          durationInFrames: SCROLL_DURATION,
          easing: Easing.inOut(Easing.cubic),
        })}
      />

      {/* Scene 4: AI Fallback */}
      <TransitionSeries.Sequence durationInFrames={AI_FALLBACK_DURATION}>
        <AiFallbackScene />
      </TransitionSeries.Sequence>

      {/* Fade: AI Fallback -> Outro */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_DURATION })}
      />

      {/* Scene 5: Outro / CTA */}
      <TransitionSeries.Sequence durationInFrames={OUTRO_DURATION}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
