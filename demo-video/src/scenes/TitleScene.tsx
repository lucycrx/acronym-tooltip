import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon bounce in
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
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
        background: tokens.zinc50,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      {/* Extension icon - dark circle with "AT" text */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: tokens.zinc950,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${iconScale})`,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            color: tokens.zinc50,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.05em',
          }}
        >
          AT
        </span>
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
            fontSize: 48,
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
          marginTop: 12,
        }}
      >
        <p
          style={{
            fontSize: 20,
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
