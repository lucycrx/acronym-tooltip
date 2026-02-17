import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';
import { FeaturePill } from '../components/FeaturePill';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon entrance
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // Title fade
  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleProgress, [0, 1], [15, 0]);

  // CTA fade
  const ctaProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [10, 0]);

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
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: tokens.zinc950,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${iconScale})`,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            color: tokens.zinc50,
            fontSize: 22,
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
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontSize: 36,
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
          gap: 16,
          marginBottom: 40,
        }}
      >
        <FeaturePill label="WUT Definitions" showAt={25} />
        <FeaturePill
          label="AI Fallback"
          showAt={35}
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
            padding: '14px 36px',
            borderRadius: tokens.radiusFull,
            fontSize: 18,
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
