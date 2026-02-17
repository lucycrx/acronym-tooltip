import React from 'react';
import { fontFamily } from '../styles/fonts';

const DOT_CX = [38, 50, 62, 74, 86];
const DOT_CY = 78;
const BOUNCE_AMP = 3; // max vertical displacement in SVG units
const WAVE_SPEED = 0.15; // radians per frame
const DOT_PHASE_OFFSET = 0.8; // radians between each dot

/**
 * Recreates icon128.png as a React component so the speech bubble
 * can be animated independently of the background.
 */
export const AppIcon: React.FC<{
  size?: number;
  bubbleStyle?: React.CSSProperties;
  frame?: number;
}> = ({ size = 200, bubbleStyle, frame = 0 }) => {
  // Scale factor relative to a 128×128 design grid
  const s = size / 128;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: 24 * s,
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
      }}
    >
      {/* Speech bubble — animatable via bubbleStyle */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...bubbleStyle,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bubble body */}
          <rect x="18" y="24" width="92" height="62" rx="12" fill="white" />
          {/* Bubble tail */}
          <polygon points="36,86 50,86 40,98" fill="white" />

          {/* "Aa" text */}
          <text
            x="64"
            y="66"
            textAnchor="middle"
            fontFamily={fontFamily}
            fontWeight="600"
            fontSize="36"
            fill="#1a1a1a"
          >
            Aa
          </text>

          {/* Blue dots — wave bounce */}
          {DOT_CX.map((cx, i) => {
            const dy =
              Math.sin(frame * WAVE_SPEED - i * DOT_PHASE_OFFSET) * BOUNCE_AMP;
            return (
              <circle
                key={cx}
                cx={cx}
                cy={DOT_CY + dy}
                r="2.5"
                fill="#0082FB"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
