import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AppIcon } from '../components/AppIcon';

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Speech bubble bounce in (the dark background is always visible)
  const bubbleScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 180, mass: 1.4 },
  });

  // Title fade up
  const titleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleProgress, [0, 1], [20, 0]);

  // Subtitle fade up (slightly delayed)
  const subtitleProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [15, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      <AnimatedBackground />

      {/* Extension icon — bubble bounces in over static background */}
      <div style={{ marginBottom: 36 }}>
        <AppIcon
          size={200}
          bubbleStyle={{
            transform: `scale(${bubbleScale})`,
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: tokens.zinc950,
            letterSpacing: '-0.025em',
            margin: 0,
            textAlign: 'center' as const,
          }}
        >
          Acronym Tooltip
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          marginTop: 20,
        }}
      >
        <p
          style={{
            fontSize: 44,
            color: tokens.zinc500,
            margin: 0,
            textAlign: 'center' as const,
          }}
        >
          Instant definitions for Meta acronyms
        </p>
      </div>
    </AbsoluteFill>
  );
};
