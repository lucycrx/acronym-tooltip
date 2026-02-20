import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

type ExtensionDetailsCardProps = {
  /** Frame at which the "Extension options" row highlights blue */
  highlightAt: number;
};

const ROWS = ['Site access', 'Extension options', 'Details'];

export const ExtensionDetailsCard: React.FC<ExtensionDetailsCardProps> = ({
  highlightAt,
}) => {
  const frame = useCurrentFrame();

  // Highlight transition: 0 → 1 over 12 frames
  const highlightProgress = interpolate(frame, [highlightAt, highlightAt + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <div
      style={{
        background: tokens.white,
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
          chrome://extensions › Acronym Tooltip
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {/* Extension header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Mini app icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: tokens.zinc950,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <text
                x="4"
                y="16"
                fontSize="11"
                fontWeight="bold"
                fill="white"
                fontFamily={fontFamily}
              >
                Aa
              </text>
              <line
                x1="5"
                y1="19"
                x2="19"
                y2="19"
                stroke="#4d9ff5"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: tokens.zinc950,
              }}
            >
              Acronym Tooltip
            </div>
            <div style={{ fontSize: 15, color: tokens.zinc400 }}>Version 1.1.0</div>
          </div>
        </div>

        {/* Link rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {ROWS.map((label) => {
            const isOptions = label === 'Extension options';
            // Interpolate border and background for the highlight row
            const borderColor = isOptions
              ? interpolateColor(highlightProgress, tokens.zinc200, tokens.blue)
              : tokens.zinc200;
            const bgColor = isOptions
              ? interpolateColor(highlightProgress, tokens.zinc50, '#f0f7ff')
              : tokens.zinc50;
            const arrowColor = isOptions
              ? interpolateColor(highlightProgress, tokens.zinc400, tokens.blue)
              : tokens.zinc400;

            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 10,
                  fontSize: 17,
                  color: tokens.zinc700,
                }}
              >
                <span style={{ fontWeight: isOptions ? 700 : 400 }}>{label}</span>
                <span style={{ color: arrowColor, fontSize: 20 }}>›</span>
              </div>
            );
          })}
        </div>

        {/* Annotation arrow (appears with highlight) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 600,
            color: tokens.blue,
            opacity: highlightProgress,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M7 1L7 10M7 10L3 6M7 10L11 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Click "Extension options" to open settings
        </div>
      </div>
    </div>
  );
};

/** Simple linear interpolation between two hex colors */
function interpolateColor(t: number, from: string, to: string): string {
  const f = hexToRgb(from);
  const tRgb = hexToRgb(to);
  const r = Math.round(f[0] + (tRgb[0] - f[0]) * t);
  const g = Math.round(f[1] + (tRgb[1] - f[1]) * t);
  const b = Math.round(f[2] + (tRgb[2] - f[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
