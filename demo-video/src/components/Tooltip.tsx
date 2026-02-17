import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

type TooltipProps = {
  term: string;
  definition: string;
  source: 'wut' | 'ai';
  upvotes?: number;
  x: number;
  y: number;
  showAt: number;
  showLoading?: boolean;
  loadingDuration?: number;
};

export const Tooltip: React.FC<TooltipProps> = ({
  term,
  definition,
  source,
  upvotes = 42,
  x,
  y,
  showAt,
  showLoading = true,
  loadingDuration = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - showAt;
  if (relativeFrame < 0) return null;

  // Entrance animation
  const enterProgress = interpolate(relativeFrame, [0, 6], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const opacity = enterProgress;
  const translateY = interpolate(enterProgress, [0, 1], [6, 0]);

  // Loading -> content transition
  const showContent = !showLoading || relativeFrame >= loadingDuration;
  const contentOpacity = showLoading
    ? interpolate(relativeFrame, [loadingDuration, loadingDuration + 8], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      })
    : 1;

  const isAI = source === 'ai';

  // Spinner rotation driven by frame
  const spinnerRotation = relativeFrame * 36;

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
          fontSize: 19,
          color: tokens.zinc950,
          maxWidth: 520,
          minWidth: 340,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '20px 22px 0 22px',
          }}
        >
          <span
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: tokens.zinc950,
            }}
          >
            {term}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              color: isAI ? tokens.purple : tokens.zinc400,
            }}
          >
            {isAI ? 'AI-generated' : 'WUT'}
          </span>
        </div>

        {/* Loading state */}
        {!showContent && (
          <div
            style={{
              padding: '28px 22px',
              textAlign: 'center' as const,
              color: tokens.zinc400,
              fontSize: 17,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: 24,
                height: 24,
                border: `3px solid ${tokens.zinc200}`,
                borderTopColor: tokens.zinc500,
                borderRadius: '50%',
                transform: `rotate(${spinnerRotation}deg)`,
                marginBottom: 8,
              }}
            />
            <div>Looking up...</div>
          </div>
        )}

        {/* Definition */}
        {showContent && (
          <div style={{ opacity: contentOpacity }}>
            <div style={{ padding: '16px 22px 0 22px' }}>
              <p style={{ color: tokens.zinc950, lineHeight: 1.5, fontSize: 19, margin: 0 }}>
                {definition}
              </p>
              {source === 'wut' && (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 16,
                    color: tokens.zinc400,
                    marginTop: 6,
                  }}
                >
                  ▲ {upvotes}
                </span>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: `1px solid ${tokens.zinc200}`,
                marginTop: 16,
                padding: '14px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <a
                style={{
                  borderRadius: tokens.radiusFull,
                  border: 'none',
                  background: tokens.blue,
                  color: tokens.white,
                  fontSize: 15,
                  fontWeight: 500,
                  padding: '6px 12px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontFamily,
                }}
              >
                {isAI ? 'Define on WUT' : 'View on WUT'}
                <svg
                  width="14"
                  height="14"
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
                  fontSize: 15,
                  fontWeight: 500,
                  padding: '5px 10px',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                Don't show again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
