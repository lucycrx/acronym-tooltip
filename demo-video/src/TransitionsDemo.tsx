import React from 'react';
import { Easing } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';

import {
  SectionHeader,
  SpringConfigsScene,
  EasingCurvesScene,
  StaggerScene,
  TypewriterScene,
  WordHighlightScene,
  CombinedTransformScene,
  ScaleRotateScene,
  ProgressBarScene,
} from './scenes/TransitionsDemoScene';

// Scene durations
const HEADER_DURATION = 60;
const DEMO_DURATION = 120;
const TRANSITION_DURATION = 20;

export const TransitionsDemo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* ── INTRO ──────────────────────────────────────────── */}
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader
          title="Remotion Showcase"
          subtitle="Transitions & Animations"
        />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 1: Spring Configurations ═══════════════ */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="1. Spring Physics" subtitle="Four spring configurations" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <SpringConfigsScene />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 2: Easing Curves ═══════════════════════ */}
      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-left' })}
        timing={linearTiming({
          durationInFrames: TRANSITION_DURATION,
          easing: Easing.inOut(Easing.quad),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="2. Easing Curves" subtitle="Different interpolation functions" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <EasingCurvesScene />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 3: Staggered Entrances ═════════════════ */}
      <TransitionSeries.Transition
        presentation={flip({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="3. Stagger Effect" subtitle="Delayed spring entrances" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={linearTiming({
          durationInFrames: TRANSITION_DURATION,
          easing: Easing.inOut(Easing.cubic),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <StaggerScene />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 4: Typewriter ══════════════════════════ */}
      <TransitionSeries.Transition
        presentation={clockWipe({ width: 1920, height: 1080 })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="4. Typewriter" subtitle="Character-by-character text reveal" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <TypewriterScene />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 5: Word Highlight ══════════════════════ */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-left' })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="5. Word Highlight" subtitle="Spring-animated text highlighting" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-right' })}
        timing={linearTiming({
          durationInFrames: TRANSITION_DURATION,
          easing: Easing.inOut(Easing.quad),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <WordHighlightScene />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 6: Combined Transforms ═════════════════ */}
      <TransitionSeries.Transition
        presentation={flip({ direction: 'from-left' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="6. Combined Transforms" subtitle="Rotation, scale, orbit" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-top' })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <CombinedTransformScene />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 7: Enter & Exit ════════════════════════ */}
      <TransitionSeries.Transition
        presentation={clockWipe({ width: 1920, height: 1080 })}
        timing={linearTiming({
          durationInFrames: TRANSITION_DURATION,
          easing: Easing.out(Easing.quad),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="7. Enter & Exit" subtitle="In + out spring animation" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <ScaleRotateScene />
      </TransitionSeries.Sequence>

      {/* ═══ SECTION 8: Progress / Interpolation ════════════ */}
      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-top' })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="8. Interpolation" subtitle="Smooth value mapping with easing" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({
          durationInFrames: TRANSITION_DURATION,
          easing: Easing.inOut(Easing.cubic),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
        <ProgressBarScene />
      </TransitionSeries.Sequence>

      {/* ═══ TRANSITION SHOWCASE ════════════════════════════ */}
      {/* Show all transition types back-to-back */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={HEADER_DURATION}>
        <SectionHeader title="Transition Types" subtitle="All built-in transitions" />
      </TransitionSeries.Sequence>

      {/* Fade */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="fade()" />
      </TransitionSeries.Sequence>

      {/* Slide from-right */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="slide('from-right')" />
      </TransitionSeries.Sequence>

      {/* Slide from-left */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-left' })}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="slide('from-left')" />
      </TransitionSeries.Sequence>

      {/* Slide from-top */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-top' })}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="slide('from-top')" />
      </TransitionSeries.Sequence>

      {/* Slide from-bottom */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="slide('from-bottom')" />
      </TransitionSeries.Sequence>

      {/* Wipe from-left */}
      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-left' })}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="wipe('from-left')" />
      </TransitionSeries.Sequence>

      {/* Wipe from-right */}
      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="wipe('from-right')" />
      </TransitionSeries.Sequence>

      {/* Flip from-right */}
      <TransitionSeries.Transition
        presentation={flip({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="flip('from-right')" />
      </TransitionSeries.Sequence>

      {/* Flip from-left */}
      <TransitionSeries.Transition
        presentation={flip({ direction: 'from-left' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 30 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="flip('from-left')" />
      </TransitionSeries.Sequence>

      {/* Clock Wipe */}
      <TransitionSeries.Transition
        presentation={clockWipe({ width: 1920, height: 1080 })}
        timing={linearTiming({ durationInFrames: 25 })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <SectionHeader title="clockWipe({ width: 1920, height: 1080 })" />
      </TransitionSeries.Sequence>

      {/* ═══ OUTRO ══════════════════════════════════════════ */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />
      <TransitionSeries.Sequence durationInFrames={90}>
        <SectionHeader
          title="That's a Wrap"
          subtitle="All powered by Remotion"
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
