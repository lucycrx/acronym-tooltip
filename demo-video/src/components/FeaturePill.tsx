import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

type FeaturePillProps = {
  label: string;
  showAt: number;
  color?: string;
  bgColor?: string;
};

export const FeaturePill: React.FC<FeaturePillProps> = ({
  label,
  showAt,
  color = tokens.zinc950,
  bgColor = tokens.zinc100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - showAt;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.2 },
  });

  const opacity = interpolate(progress, [0, 0.6], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const translateY = interpolate(progress, [0, 1], [12, 0]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '14px 32px',
        borderRadius: tokens.radiusFull,
        background: bgColor,
        border: `1px solid ${tokens.zinc200}`,
        fontFamily,
        fontSize: 24,
        fontWeight: 600,
        color,
        opacity,
        transform: `translateY(${translateY}px)`,
        transformOrigin: 'center',
      }}
    >
      {label}
    </div>
  );
};
