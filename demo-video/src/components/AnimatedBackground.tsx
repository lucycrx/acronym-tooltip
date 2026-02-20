import React from 'react';
import { AbsoluteFill } from 'remotion';

export const AnimatedBackground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#f3f6fc',
        zIndex: 0,
      }}
    />
  );
};
