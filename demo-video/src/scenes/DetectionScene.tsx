import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';
import { AcronymText } from '../components/AcronymText';
import { Cursor } from '../components/Cursor';
import { Tooltip } from '../components/Tooltip';
import { Callout } from '../components/Callout';

const POST_TEXT =
  'A couple of bugs on MAISA Help Center. When I first send a message to MAISA from the Help Center it will take me to the message thread. However after several seconds it will then reload the thread.';

// "MAISA" appears at two positions in the text
const MAISA_POS_1 = POST_TEXT.indexOf('MAISA');
const MAISA_POS_2 = POST_TEXT.indexOf('MAISA', MAISA_POS_1 + 1);

// Card position constants
const CARD_X = 360;
const CARD_Y = 280;
const CARD_W = 1200;

// Acronym position on screen (approximate for MAISA #1 in the card)
const ACRONYM_SCREEN_X = CARD_X + 210;
const ACRONYM_SCREEN_Y = CARD_Y + 85;

export const DetectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (450 total frames = 15s for scenes 2+3 combined)
  // 0-30: Card appears
  // 30-90: Acronyms get underlines progressively
  // 90-130: Cursor moves to MAISA
  // 130-140: Underline darkens (hover)
  // 140-146: Tooltip appears
  // 146-166: Loading spinner
  // 166+: Definition shown with callouts

  // Card entrance
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.97, 1]);

  // Cursor keyframes: enter from bottom-right, then move to MAISA
  const cursorKeyframes: [number, number, number][] = [
    [60, CARD_X + CARD_W - 100, CARD_Y + 250],
    [110, ACRONYM_SCREEN_X + 20, ACRONYM_SCREEN_Y + 8],
  ];

  return (
    <AbsoluteFill
      style={{
        background: tokens.zinc50,
        fontFamily,
      }}
    >
      {/* Floating card */}
      <div
        style={{
          position: 'absolute',
          left: CARD_X,
          top: CARD_Y,
          width: CARD_W,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          transformOrigin: 'center',
        }}
      >
        <div
          style={{
            background: tokens.white,
            borderRadius: tokens.radius,
            border: `1px solid ${tokens.zinc200}`,
            boxShadow: tokens.shadow,
            padding: '32px 40px',
          }}
        >
          {/* Post header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: tokens.zinc200,
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
                Bug Report
              </div>
              <div style={{ fontSize: 11, color: tokens.zinc400 }}>
                Workplace · 2h ago
              </div>
            </div>
          </div>

          {/* Post text with acronym highlights */}
          <div style={{ fontSize: 18, lineHeight: 1.65, color: tokens.zinc950 }}>
            <AcronymText
              text={POST_TEXT}
              acronyms={[
                {
                  word: 'MAISA',
                  startIndex: MAISA_POS_1,
                  underlineAt: 30,
                  hoverAt: 125,
                },
                {
                  word: 'MAISA',
                  startIndex: MAISA_POS_2,
                  underlineAt: 50,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Cursor */}
      {frame >= 60 && (
        <Cursor keyframes={cursorKeyframes} />
      )}

      {/* Tooltip */}
      <Tooltip
        term="MAISA"
        definition="Meta AI Support Assistant"
        source="wut"
        upvotes={42}
        x={ACRONYM_SCREEN_X - 30}
        y={ACRONYM_SCREEN_Y - 155}
        showAt={140}
        showLoading={true}
        loadingDuration={26}
      />

      {/* Callouts - appear after definition loads */}
      <Callout
        label="Source badge"
        x={ACRONYM_SCREEN_X + 260}
        y={ACRONYM_SCREEN_Y - 170}
        targetX={ACRONYM_SCREEN_X + 70}
        targetY={ACRONYM_SCREEN_Y - 140}
        showAt={190}
        color={tokens.zinc500}
      />
      <Callout
        label="WUT link"
        x={ACRONYM_SCREEN_X + 270}
        y={ACRONYM_SCREEN_Y - 40}
        targetX={ACRONYM_SCREEN_X + 130}
        targetY={ACRONYM_SCREEN_Y - 18}
        showAt={210}
        color={tokens.blue}
      />
    </AbsoluteFill>
  );
};
