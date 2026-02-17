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

  const scale = spring({
    frame: relFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 24px',
        borderRadius: tokens.radiusFull,
        background: bgColor,
        border: `1px solid ${tokens.zinc200}`,
        fontFamily,
        fontSize: 16,
        fontWeight: 600,
        color,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      {label}
    </div>
  );
};
