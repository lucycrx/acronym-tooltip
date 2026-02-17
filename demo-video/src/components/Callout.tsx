import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

type CalloutProps = {
  label: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  showAt: number;
  color?: string;
};

export const Callout: React.FC<CalloutProps> = ({
  label,
  x,
  y,
  targetX,
  targetY,
  showAt,
  color = tokens.zinc700,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - showAt;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Line endpoint animates from label to target
  const lineEndX = interpolate(progress, [0, 1], [x, targetX]);
  const lineEndY = interpolate(progress, [0, 1], [y, targetY]);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity, zIndex: 150 }}>
      {/* Line */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <line
          x1={x}
          y1={y}
          x2={lineEndX}
          y2={lineEndY}
          stroke={color}
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        {/* Small dot at target end */}
        <circle cx={lineEndX} cy={lineEndY} r="4" fill={color} />
      </svg>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          left: x - 110,
          top: y - 32,
          width: 220,
          textAlign: 'center' as const,
          fontFamily,
          fontSize: 16,
          fontWeight: 600,
          color,
          transform: `scale(${progress})`,
        }}
      >
        {label}
      </div>
    </div>
  );
};
