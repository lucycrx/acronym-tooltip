import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

type SettingsCardProps = {
  /** Frame at which the typewriter starts */
  typewriterAt: number;
  /** Frame at which the "API key saved." text appears */
  savedAt: number;
};

const API_KEY = 'ape-k1-a7f3...x9d2';

export const SettingsCard: React.FC<SettingsCardProps> = ({
  typewriterAt,
  savedAt,
}) => {
  const frame = useCurrentFrame();

  // Typewriter effect: reveal characters over time
  const typewriterFrame = frame - typewriterAt;
  const charsToShow =
    typewriterFrame < 0
      ? 0
      : Math.min(API_KEY.length, Math.floor(typewriterFrame / 2));
  const displayedKey = API_KEY.slice(0, charsToShow);
  const showCursor = typewriterFrame >= 0 && charsToShow < API_KEY.length;

  // Blinking cursor
  const cursorVisible = showCursor && Math.floor(frame / 8) % 2 === 0;

  // "API key saved." green text fade-in
  const savedProgress = interpolate(frame, [savedAt, savedAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // AI section border highlight (appears with typewriter)
  const sectionHighlight = interpolate(
    frame,
    [typewriterAt, typewriterAt + 10],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <div
      style={{
        background: tokens.zinc50,
        border: `1px solid ${tokens.zinc200}`,
        borderRadius: 14,
        overflow: 'hidden',
        fontFamily,
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          background: tokens.zinc200,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: tokens.zinc300,
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: 10,
            background: tokens.white,
            borderRadius: 7,
            padding: '5px 12px',
            fontSize: 14,
            color: tokens.zinc500,
            fontFamily,
          }}
        >
          chrome-extension://... › options.html
        </div>
      </div>

      {/* Settings content */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 24px' }}>
        <h3
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            marginBottom: 24,
            color: tokens.zinc950,
          }}
        >
          Acronym Tooltip Settings
        </h3>

        {/* AI Fallback section — highlighted */}
        <div
          style={{
            background: tokens.white,
            border: `1px solid ${sectionHighlight > 0.5 ? tokens.blue : tokens.zinc200}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 14,
            boxShadow:
              sectionHighlight > 0.5
                ? '0 0 0 3px rgba(0,130,251,0.08)'
                : 'none',
          }}
        >
          <h4
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: 4,
              color: tokens.zinc950,
            }}
          >
            AI Fallback (APE API)
          </h4>
          <div
            style={{
              fontSize: 15,
              color: tokens.zinc500,
              marginBottom: 14,
              lineHeight: 1.5,
            }}
          >
            When no WUT definition exists, the extension uses AI to generate a
            definition. Get your API key from{' '}
            <span
              style={{
                color: tokens.zinc700,
                textDecoration: 'underline',
              }}
            >
              wearables-ape.io
            </span>
            .
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                flex: 1,
                padding: '10px 14px',
                border: `1px solid ${tokens.zinc200}`,
                borderRadius: 12,
                fontSize: 15,
                color: tokens.zinc950,
                background: tokens.zinc50,
                minHeight: 22,
              }}
            >
              {displayedKey}
              {cursorVisible && (
                <span style={{ borderRight: `2px solid ${tokens.zinc950}` }}>
                  {' '}
                </span>
              )}
              {!displayedKey && !showCursor && (
                <span style={{ color: tokens.zinc400 }}>Enter API key...</span>
              )}
            </div>
            <button
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                background: tokens.zinc950,
                color: tokens.zinc50,
                fontFamily,
              }}
            >
              Save
            </button>
            <button
              style={{
                padding: '10px 18px',
                border: `1px solid ${tokens.zinc200}`,
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                background: tokens.zinc100,
                color: tokens.zinc700,
                fontFamily,
              }}
            >
              Clear
            </button>
          </div>

          {/* Status */}
          {savedProgress > 0 && (
            <div
              style={{
                fontSize: 14,
                color: '#16a34a',
                marginTop: 8,
                opacity: savedProgress,
              }}
            >
              API key saved.
            </div>
          )}
        </div>

        {/* Dismissed Terms section — faded */}
        <div
          style={{
            background: tokens.white,
            border: `1px solid ${tokens.zinc200}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 14,
            opacity: 0.5,
          }}
        >
          <h4
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: 4,
              color: tokens.zinc950,
            }}
          >
            Dismissed Terms
          </h4>
          <div style={{ fontSize: 15, color: tokens.zinc500, lineHeight: 1.5 }}>
            Terms you've dismissed won't show tooltips.
          </div>
        </div>

        {/* Appearance section — faded */}
        <div
          style={{
            background: tokens.white,
            border: `1px solid ${tokens.zinc200}`,
            borderRadius: 16,
            padding: 20,
            opacity: 0.5,
          }}
        >
          <h4
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: 4,
              color: tokens.zinc950,
            }}
          >
            Appearance
          </h4>
          <div style={{ fontSize: 15, color: tokens.zinc500, lineHeight: 1.5 }}>
            Tooltip delay (ms)
          </div>
        </div>
      </div>
    </div>
  );
};
