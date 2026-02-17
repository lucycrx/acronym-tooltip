import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = frame * 0.5;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #e4e0f0, #dde9f7, #f5f5f5, #f5ebdd)`,
        zIndex: 0,
      }}
    />
  );
};
