import React from 'react';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';

type BrowserChromeProps = {
  url: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const BrowserChrome: React.FC<BrowserChromeProps> = ({ url, children, style }) => {
  return (
    <div
      style={{
        background: tokens.zinc50,
        border: `1px solid ${tokens.zinc200}`,
        borderRadius: 20,
        boxShadow: tokens.shadow,
        overflow: 'hidden',
        ...style,
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
        {/* Traffic light dots */}
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
        {/* URL bar */}
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
          {url}
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          padding: '28px 24px',
          position: 'relative',
          minHeight: 260,
        }}
      >
        {children}
      </div>
    </div>
  );
};
