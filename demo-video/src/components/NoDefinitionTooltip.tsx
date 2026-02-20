import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

type NoDefinitionTooltipProps = {
  term: string;
  x: number;
  y: number;
  showAt: number;
};

export const NoDefinitionTooltip: React.FC<NoDefinitionTooltipProps> = ({
  term,
  x,
  y,
  showAt,
}) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - showAt;
  if (relativeFrame < 0) return null;

  // Entrance animation (matches Tooltip pattern)
  const enterProgress = interpolate(relativeFrame, [0, 6], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const opacity = enterProgress;
  const translateY = interpolate(enterProgress, [0, 1], [6, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily,
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: tokens.zinc50,
          border: `1px solid ${tokens.zinc200}`,
          borderRadius: 20,
          boxShadow: tokens.shadow,
          fontSize: 24,
          color: tokens.zinc950,
          maxWidth: 640,
          minWidth: 380,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '24px 28px 0 28px',
          }}
        >
          <span
            style={{
              fontSize: 27,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: tokens.zinc950,
            }}
          >
            {term}
          </span>
        </div>

        {/* Error message */}
        <div
          style={{
            padding: '20px 28px',
            color: tokens.zinc500,
            fontSize: 22,
            textAlign: 'center' as const,
            lineHeight: 1.5,
          }}
        >
          No definitions found.
          <br />
          Add an API key in extension options
          <br />
          for AI-generated definitions.
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `1px solid ${tokens.zinc200}`,
            padding: '18px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 14,
          }}
        >
          <a
            style={{
              borderRadius: tokens.radiusFull,
              border: 'none',
              background: tokens.blue,
              color: tokens.white,
              fontSize: 19,
              fontWeight: 500,
              padding: '8px 16px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily,
            }}
          >
            Define on WUT
            <svg
              width="18"
              height="18"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.5 1.5L5.5 6.5" />
              <path d="M7 1.5H10.5V5" />
              <path d="M10.5 7.5V10A1 1 0 0 1 9.5 11H2A1 1 0 0 1 1 10V2.5A1 1 0 0 1 2 1.5H4.5" />
            </svg>
          </a>
          <button
            style={{
              borderRadius: tokens.radiusFull,
              border: `1px solid ${tokens.zinc300}`,
              background: 'transparent',
              color: tokens.zinc500,
              fontFamily,
              fontSize: 19,
              fontWeight: 500,
              padding: '7px 14px',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
};
