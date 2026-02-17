import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

type CursorProps = {
  /** Keyframes: [frame, x, y][] */
  keyframes: [number, number, number][];
};

export const Cursor: React.FC<CursorProps> = ({ keyframes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (keyframes.length === 0) return null;

  // Find the two keyframes we're between
  let x: number;
  let y: number;

  if (frame <= keyframes[0][0]) {
    // Before first keyframe - use entrance animation
    const entranceProgress = spring({
      frame,
      fps,
      config: { damping: 20, stiffness: 80, mass: 1.2 },
      durationInFrames: keyframes[0][0],
    });
    x = interpolate(entranceProgress, [0, 1], [keyframes[0][1] + 100, keyframes[0][1]]);
    y = interpolate(entranceProgress, [0, 1], [keyframes[0][2] + 60, keyframes[0][2]]);
  } else if (frame >= keyframes[keyframes.length - 1][0]) {
    x = keyframes[keyframes.length - 1][1];
    y = keyframes[keyframes.length - 1][2];
  } else {
    // Find surrounding keyframes
    let fromIdx = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (frame >= keyframes[i][0] && frame < keyframes[i + 1][0]) {
        fromIdx = i;
        break;
      }
    }
    const from = keyframes[fromIdx];
    const to = keyframes[fromIdx + 1];

    const progress = spring({
      frame: frame - from[0],
      fps,
      config: { damping: 20, stiffness: 80, mass: 1.2 },
      durationInFrames: to[0] - from[0],
    });

    x = interpolate(progress, [0, 1], [from[1], to[1]]);
    y = interpolate(progress, [0, 1], [from[2], to[2]]);
  }

  // Cursor opacity - fade in
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Pulsing ring animation (loops every 30 frames = 1s)
  const pulseProgress = (frame % 30) / 30;
  const ringScale = interpolate(pulseProgress, [0, 1], [0.8, 1.6]);
  const ringOpacity = interpolate(pulseProgress, [0, 0.5, 1], [0.6, 0.3, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        zIndex: 200,
        pointerEvents: 'none' as const,
      }}
    >
      {/* Pulsing ring behind cursor tip */}
      <div
        style={{
          position: 'absolute',
          left: -36,
          top: -36,
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.3)',
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <svg
        width="36"
        height="44"
        viewBox="0 0 20 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cursor pointer shape */}
        <path
          d="M2 1L2 17L6.5 13L11 20L14 18.5L9.5 11.5L15 10.5L2 1Z"
          fill="#09090b"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
