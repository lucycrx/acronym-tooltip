import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ExtensionDetailsCard } from '../components/ExtensionDetailsCard';
import { SettingsCard } from '../components/SettingsCard';
import { FeaturePill } from '../components/FeaturePill';
import { Callout } from '../components/Callout';

const SCENE_DELAY = 30;

// Layout constants
const COL_LEFT_X = 80;
const COL_RIGHT_X = 980;
const COL_W = 840;
const COL_Y = 380;

export const Feature3Scene: React.FC = () => {
  const frame = useCurrentFrame() - SCENE_DELAY;
  const { fps } = useVideoConfig();

  // ── Title entrance ──
  const titleProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleProgress, [0, 1], [15, 0]);

  const descProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const descOpacity = interpolate(descProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const descY = interpolate(descProgress, [0, 1], [12, 0]);

  // ── Left column spring ──
  const leftProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const leftOpacity = interpolate(leftProgress, [0, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const leftY = interpolate(leftProgress, [0, 1], [30, 0]);

  // ── Right column spring (staggered) ──
  const rightProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const rightOpacity = interpolate(rightProgress, [0, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightY = interpolate(rightProgress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AnimatedBackground />

      {/* Feature pill */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FeaturePill
          label="FEATURE 3"
          showAt={0}
          color={tokens.white}
          bgColor={tokens.blue}
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          textAlign: 'center' as const,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: tokens.zinc950,
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          Adding Your API Key in Extension Settings
        </h2>
      </div>

      {/* Description */}
      <div
        style={{
          position: 'absolute',
          top: 205,
          left: 0,
          right: 0,
          textAlign: 'center' as const,
          opacity: descOpacity,
          transform: `translateY(${descY}px)`,
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: tokens.zinc500,
            margin: 0,
          }}
        >
          Configure your APE API key to enable AI-generated definitions.
        </p>
      </div>

      {/* Column labels */}
      <div
        style={{
          position: 'absolute',
          top: COL_Y - 40,
          left: COL_LEFT_X,
          fontSize: 18,
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          color: tokens.zinc400,
          opacity: leftOpacity,
        }}
      >
        Step 1 — Open extension options
      </div>
      <div
        style={{
          position: 'absolute',
          top: COL_Y - 40,
          left: COL_RIGHT_X,
          fontSize: 18,
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          color: tokens.zinc400,
          opacity: rightOpacity,
        }}
      >
        Step 2 — Paste your API key
      </div>

      {/* Left column — Extension details card */}
      <div
        style={{
          position: 'absolute',
          left: COL_LEFT_X,
          top: COL_Y,
          width: COL_W,
          opacity: leftOpacity,
          transform: `translateY(${leftY}px)`,
        }}
      >
        <ExtensionDetailsCard highlightAt={40} />
      </div>

      {/* Right column — Settings card */}
      <div
        style={{
          position: 'absolute',
          left: COL_RIGHT_X,
          top: COL_Y,
          width: COL_W,
          opacity: rightOpacity,
          transform: `translateY(${rightY}px)`,
        }}
      >
        <SettingsCard typewriterAt={70} savedAt={100} />
      </div>

      {/* Callout */}
      <Callout
        label="Paste your APE API key and click Save"
        x={1500}
        y={950}
        targetX={COL_RIGHT_X + 400}
        targetY={COL_Y + 300}
        showAt={120}
        color={tokens.blue}
      />
    </AbsoluteFill>
  );
};
