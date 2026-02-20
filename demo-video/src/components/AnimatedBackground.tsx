import React from 'react';
import { AbsoluteFill } from 'remotion';

export const AnimatedBackground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#eae6e1',
        zIndex: 0,
      }}
    />
  );
};
