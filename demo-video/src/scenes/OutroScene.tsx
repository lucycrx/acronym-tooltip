import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';
import { FeaturePill } from '../components/FeaturePill';

export const OutroScene: React.FC = () => {
  // Delay all animations so content appears after the incoming transition settles
  const SCENE_DELAY = 30;
  const frame = useCurrentFrame() - SCENE_DELAY;
  const { fps } = useVideoConfig();

  // Icon entrance
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // Title fade
  const titleProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1.2 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleProgress, [0, 1], [15, 0]);

  // CTA fade
  const ctaProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.2 },
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [12, 0]);

  return (
    <AbsoluteFill
      style={{
        background: tokens.zinc50,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      {/* Icon */}
      <Img
        src={staticFile('icon128.png')}
        style={{
          width: 120,
          height: 120,
          transform: `scale(${iconScale})`,
          marginBottom: 32,
        }}
      />

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 40,
        }}
      >
        <h1
          style={{
            fontSize: 64,
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

      {/* Feature pills */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 48,
        }}
      >
        <FeaturePill label="WUT Definitions" showAt={30} />
        <FeaturePill
          label="AI Fallback"
          showAt={50}
          bgColor="#f5f3ff"
          color={tokens.purple}
        />
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            background: tokens.zinc950,
            color: tokens.zinc50,
            padding: '18px 48px',
            borderRadius: tokens.radiusFull,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Install it today
        </div>
      </div>
    </AbsoluteFill>
  );
};
