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

  // Slow drift factor for organic blob movement
  const t = frame * 0.008;

  // Blob center positions that drift over time
  const b1x = 25 + Math.sin(t * 1.1) * 12;
  const b1y = 30 + Math.cos(t * 0.9) * 10;
  const b2x = 72 + Math.sin(t * 0.8 + 1.5) * 14;
  const b2y = 22 + Math.cos(t * 1.2 + 2.0) * 10;
  const b3x = 78 + Math.sin(t * 0.7 + 3.0) * 12;
  const b3y = 72 + Math.cos(t * 1.0 + 1.0) * 14;
  const b4x = 28 + Math.sin(t * 0.9 + 2.5) * 14;
  const b4y = 78 + Math.cos(t * 0.8 + 3.5) * 10;

  // Palette matched to reference screenshot:
  // warm peach sweep, soft sage green, faint lavender/mauve
  const blob1 = vibrant
    ? 'rgba(232, 198, 158, 0.50)' // warm peach/apricot
    : 'rgba(180, 200, 170, 0.35)';
  const blob2 = vibrant
    ? 'rgba(168, 194, 162, 0.45)' // sage green
    : 'rgba(180, 200, 218, 0.30)';
  const blob3 = vibrant
    ? 'rgba(200, 178, 200, 0.35)' // soft lavender/mauve
    : 'rgba(228, 212, 194, 0.30)';
  const blob4 = vibrant
    ? 'rgba(220, 200, 165, 0.30)' // light warm gold
    : 'rgba(210, 198, 204, 0.25)';

  const base = vibrant
    ? '#eeeae4' // near-white warm tint
    : '#ede9e4'; // light warm neutral

  const background = [
    `radial-gradient(ellipse 70% 60% at ${b1x}% ${b1y}%, ${blob1} 0%, transparent 100%)`,
    `radial-gradient(ellipse 60% 70% at ${b2x}% ${b2y}%, ${blob2} 0%, transparent 100%)`,
    `radial-gradient(ellipse 65% 55% at ${b3x}% ${b3y}%, ${blob3} 0%, transparent 100%)`,
    `radial-gradient(ellipse 55% 65% at ${b4x}% ${b4y}%, ${blob4} 0%, transparent 100%)`,
    base,
  ].join(', ');

  return (
    <AbsoluteFill
      style={{
        background,
        zIndex: 0,
      }}
    />
  );
};
