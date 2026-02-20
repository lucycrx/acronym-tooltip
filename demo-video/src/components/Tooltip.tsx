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
  upvotes,
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
          fontSize: 24,
          color: tokens.zinc950,
          maxWidth: 640,
          minWidth: 420,
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
          <span
            style={{
              fontSize: 17,
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
              padding: '34px 28px',
              textAlign: 'center' as const,
              color: tokens.zinc400,
              fontSize: 22,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: 30,
                height: 30,
                border: `3px solid ${tokens.zinc200}`,
                borderTopColor: tokens.zinc500,
                borderRadius: '50%',
                transform: `rotate(${spinnerRotation}deg)`,
                marginBottom: 10,
              }}
            />
            <div>Looking up...</div>
          </div>
        )}

        {/* Definition */}
        {showContent && (
          <div style={{ opacity: contentOpacity }}>
            <div style={{ padding: '20px 28px 0 28px' }}>
              <p style={{ color: tokens.zinc950, lineHeight: 1.5, fontSize: 24, margin: 0 }}>
                {definition}
              </p>
              {source === 'wut' && upvotes != null && (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 20,
                    color: tokens.zinc400,
                    marginTop: 8,
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
                marginTop: 20,
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
                {isAI ? 'Define on WUT' : 'View on WUT'}
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
        )}
      </div>
    </div>
  );
};
