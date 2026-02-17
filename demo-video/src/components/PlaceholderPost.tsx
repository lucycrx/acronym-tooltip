import React from 'react';
import { tokens } from '../styles/tokens';

interface PlaceholderPostProps {
  width: number;
  lines?: number;
}

const LINE_WIDTHS = [0.95, 0.85, 0.7, 0.6, 0.5];

export const PlaceholderPost: React.FC<PlaceholderPostProps> = ({
  width,
  lines = 3,
}) => {
  return (
    <div
      style={{
        width,
        background: tokens.white,
        borderRadius: 20,
        border: `1px solid ${tokens.zinc200}`,
        boxShadow: tokens.shadow,
        padding: '44px 56px',
      }}
    >
      {/* Header: avatar + name/timestamp bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: tokens.zinc200,
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              width: 160,
              height: 18,
              borderRadius: 9,
              background: tokens.zinc200,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              width: 100,
              height: 14,
              borderRadius: 7,
              background: tokens.zinc100,
            }}
          />
        </div>
      </div>

      {/* Text line bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            style={{
              width: `${(LINE_WIDTHS[i % LINE_WIDTHS.length]) * 100}%`,
              height: 18,
              borderRadius: 9,
              background: tokens.zinc200,
            }}
          />
        ))}
      </div>
    </div>
  );
};
