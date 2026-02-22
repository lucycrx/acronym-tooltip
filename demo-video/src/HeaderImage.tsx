import React from 'react';
import { AbsoluteFill } from 'remotion';
import { tokens } from './styles/tokens';
import { fontFamily } from './styles/fonts';
import { AppIcon } from './components/AppIcon';

const POST_TEXT =
  "We're rolling out a new XFN review process for Q2. Check the updated PSC guidelines before your next EPD sync.";

const XFN_POS = POST_TEXT.indexOf('XFN');
const PSC_POS = POST_TEXT.indexOf('PSC');
const EPD_POS = POST_TEXT.indexOf('EPD');

export const HeaderImage: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        fontFamily,
        background: '#f3f6fc',
      }}
    >
      {/* Left side — branding */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px',
        }}
      >
        <div style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.12))' }}>
          <AppIcon size={100} frame={40} />
        </div>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: tokens.zinc950,
            letterSpacing: '-0.03em',
            margin: '20px 0 0',
            textAlign: 'center' as const,
          }}
        >
          Acronym Tooltip
        </h1>
        <p
          style={{
            fontSize: 18,
            color: tokens.zinc500,
            margin: '10px 0 0',
            textAlign: 'center' as const,
            maxWidth: 380,
            lineHeight: 1.5,
          }}
        >
          Hover over acronyms on Meta internal sites to instantly see
          definitions from WUT and AI.
        </p>
      </div>

      {/* Right side — browser mockup with tooltip */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 40,
          bottom: 40,
          width: '52%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            background: tokens.zinc50,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
          }}
        >
          {/* Chrome bar */}
          <div
            style={{
              background: tokens.zinc200,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: tokens.zinc300,
                }}
              />
            ))}
            <div
              style={{
                flex: 1,
                marginLeft: 8,
                background: tokens.white,
                borderRadius: 5,
                padding: '3px 10px',
                fontSize: 11,
                color: tokens.zinc500,
                fontFamily,
              }}
            >
              workplace.com/groups/engineering-updates
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 20px', position: 'relative' }}>
            {/* Post card */}
            <div
              style={{
                background: tokens.white,
                border: `1px solid ${tokens.zinc200}`,
                borderRadius: 12,
                padding: 18,
                maxWidth: 440,
              }}
            >
              {/* Post header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${tokens.zinc300}, ${tokens.zinc400})`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: tokens.zinc950,
                    }}
                  >
                    Alex Zhang
                  </div>
                  <div style={{ fontSize: 10, color: tokens.zinc400 }}>2h ago</div>
                </div>
              </div>

              {/* Post text with underlined acronyms */}
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: tokens.zinc700,
                }}
              >
                {renderTextWithAcronyms(POST_TEXT, [
                  { word: 'XFN', startIndex: XFN_POS, hover: true },
                  { word: 'PSC', startIndex: PSC_POS },
                  { word: 'EPD', startIndex: EPD_POS },
                ])}
              </div>
            </div>

            {/* Static tooltip */}
            <div
              style={{
                position: 'absolute',
                left: 230,
                top: 16,
                background: tokens.zinc50,
                border: `1px solid ${tokens.zinc200}`,
                borderRadius: 14,
                boxShadow: tokens.shadow,
                fontSize: 13,
                color: tokens.zinc950,
                maxWidth: 300,
                minWidth: 220,
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 14px 0 14px',
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    color: tokens.zinc950,
                  }}
                >
                  XFN
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    color: tokens.zinc400,
                  }}
                >
                  WUT
                </span>
              </div>

              {/* Definition */}
              <div
                style={{
                  padding: '10px 14px 0',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: tokens.zinc950,
                }}
              >
                Cross-functional — referring to collaboration between different
                teams or disciplines.
              </div>

              {/* Footer */}
              <div
                style={{
                  borderTop: `1px solid ${tokens.zinc200}`,
                  marginTop: 10,
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    borderRadius: tokens.radiusFull,
                    background: tokens.blue,
                    color: tokens.white,
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '4px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  View on WUT
                  <svg
                    width="10"
                    height="10"
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
                </div>
                <div
                  style={{
                    borderRadius: tokens.radiusFull,
                    border: `1px solid ${tokens.zinc300}`,
                    color: tokens.zinc500,
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '3px 8px',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  Don't show again
                </div>
              </div>
            </div>

            {/* Cursor */}
            <svg
              width="20"
              height="24"
              viewBox="0 0 20 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                left: 220,
                top: 108,
                zIndex: 20,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
              }}
            >
              <path
                d="M2 1L2 17L6.5 13L11 20L14 18.5L9.5 11.5L15 10.5L2 1Z"
                fill="#09090b"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Render text with statically underlined acronyms (no animation needed) */
function renderTextWithAcronyms(
  text: string,
  acronyms: { word: string; startIndex: number; hover?: boolean }[],
) {
  const sorted = [...acronyms].sort((a, b) => a.startIndex - b.startIndex);
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const acr of sorted) {
    if (acr.startIndex > lastIndex) {
      segments.push(text.slice(lastIndex, acr.startIndex));
    }
    segments.push(
      <span
        key={acr.startIndex}
        style={{
          borderBottom: `1px dotted ${acr.hover ? tokens.zinc700 : tokens.zinc400}`,
          paddingBottom: 1,
        }}
      >
        {acr.word}
      </span>,
    );
    lastIndex = acr.startIndex + acr.word.length;
  }
  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }
  return segments;
}
