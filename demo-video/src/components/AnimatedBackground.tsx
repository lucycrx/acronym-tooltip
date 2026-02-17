import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = frame * 0.5;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #f0eef5, #eef3fa, #fafafa, #faf5ee)`,
        zIndex: 0,
      }}
    />
  );
};
