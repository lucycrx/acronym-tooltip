import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

type AnimatedBackgroundProps = {
  /** Use richer, more saturated colors for intro/outro scenes */
  vibrant?: boolean;
};

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  vibrant = false,
}) => {
  const frame = useCurrentFrame();
  const angle = frame * 0.5;

  const colors = vibrant
    ? '#c8b8e8, #a8ccf0, #e0d4f0, #f0d4b0'
    : '#e4e0f0, #dde9f7, #f5f5f5, #f5ebdd';

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${colors})`,
        zIndex: 0,
      }}
    />
  );
};
