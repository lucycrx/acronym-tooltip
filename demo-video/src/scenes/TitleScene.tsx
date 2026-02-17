import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';
import { AnimatedBackground } from '../components/AnimatedBackground';

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
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      <AnimatedBackground />

      {/* Extension icon */}
      <Img
        src={staticFile('icon128.png')}
        style={{
          width: 200,
          height: 200,
          transform: `scale(${iconScale})`,
          marginBottom: 36,
        }}
      />

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
