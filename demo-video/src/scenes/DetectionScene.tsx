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
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AcronymText } from '../components/AcronymText';
import { Cursor } from '../components/Cursor';
import { Tooltip } from '../components/Tooltip';
import { PlaceholderPost } from '../components/PlaceholderPost';

const POST_TEXT =
  'A couple of bugs on MAISA Help Center. When I first send a message to MAISA from the Help Center it will take me to the message thread. However after several seconds it will then reload the thread.';

// "MAISA" appears at two positions in the text
const MAISA_POS_1 = POST_TEXT.indexOf('MAISA');
const MAISA_POS_2 = POST_TEXT.indexOf('MAISA', MAISA_POS_1 + 1);

// Card position constants — large card, centered
const CARD_X = 160;
const CARD_Y = 600;
const CARD_W = 1600;

// Acronym position on screen (approximate for MAISA #1 in the card)
// "A couple of bugs on " = 20 chars before MAISA, ~14px each at 30px Inter
const ACRONYM_SCREEN_X = CARD_X + 340;
const ACRONYM_SCREEN_Y = CARD_Y + 140;

export const DetectionScene: React.FC = () => {
  // Delay all animations so content appears after the incoming transition settles
  const SCENE_DELAY = 30;
  const frame = useCurrentFrame() - SCENE_DELAY;
  const { fps } = useVideoConfig();

  // Scene timing (210 total frames = 7s for scenes 2+3 combined)
  // 0-15: Card appears
  // 15-40: Acronyms get underlines progressively
  // 40-70: Cursor moves to MAISA
  // 70-78: Underline darkens (hover)
  // 78-84: Tooltip appears
  // 84-104: Loading spinner
  // 104+: Definition shown

  // Scroll deceleration — feed scrolls upward and stops
  const scrollY = interpolate(frame, [0, 25], [500, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Scene title fade
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleProgress, [0, 1], [15, 0]);

  // Cursor keyframes: enter from bottom-right, then move to MAISA
  const cursorKeyframes: [number, number, number][] = [
    [30, CARD_X + CARD_W - 100, CARD_Y + 300],
    [65, ACRONYM_SCREEN_X + 25, ACRONYM_SCREEN_Y + 10],
  ];

  return (
    <AbsoluteFill
      style={{
        fontFamily,
      }}
    >
      <AnimatedBackground />

      {/* Scene title */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 0,
          right: 0,
          textAlign: 'center' as const,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <p
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: tokens.zinc950,
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          The tooltip detects acronyms
          <br />
          and looks up definitions from WUT on hover
        </p>
      </div>

      {/* Placeholder post above */}
      <div
        style={{
          position: 'absolute',
          left: CARD_X,
          top: CARD_Y - 250,
          width: CARD_W,
          transform: `translateY(${scrollY}px)`,
        }}
      >
        <PlaceholderPost width={CARD_W} lines={2} />
      </div>

      {/* Floating card */}
      <div
        style={{
          position: 'absolute',
          left: CARD_X,
          top: CARD_Y,
          width: CARD_W,
          transform: `translateY(${scrollY}px)`,
        }}
      >
        <div
          style={{
            background: tokens.white,
            borderRadius: 20,
            border: `1px solid ${tokens.zinc200}`,
            boxShadow: tokens.shadow,
            padding: '44px 56px',
          }}
        >
          {/* Post header */}
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
                  fontSize: 22,
                  fontWeight: 600,
                  color: tokens.zinc950,
                }}
              >
                Bug Report
              </div>
              <div style={{ fontSize: 17, color: tokens.zinc400 }}>
                Workplace · 2h ago
              </div>
            </div>
          </div>

          {/* Post text with acronym highlights */}
          <div style={{ fontSize: 30, lineHeight: 1.65, color: tokens.zinc950 }}>
            <AcronymText
              text={POST_TEXT}
              acronyms={[
                {
                  word: 'MAISA',
                  startIndex: MAISA_POS_1,
                  underlineAt: 20,
                  hoverAt: 72,
                },
                {
                  word: 'MAISA',
                  startIndex: MAISA_POS_2,
                  underlineAt: 35,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Placeholder post below */}
      <div
        style={{
          position: 'absolute',
          left: CARD_X,
          top: CARD_Y + 400,
          width: CARD_W,
          transform: `translateY(${scrollY}px)`,
        }}
      >
        <PlaceholderPost width={CARD_W} lines={4} />
      </div>

      {/* Cursor */}
      {frame >= 30 && (
        <Cursor keyframes={cursorKeyframes} />
      )}

      {/* Tooltip */}
      <Tooltip
        term="MAISA"
        definition="Meta AI Support Assistant"
        source="wut"
        upvotes={42}
        x={ACRONYM_SCREEN_X - 30}
        y={ACRONYM_SCREEN_Y - 280}
        showAt={78}
        showLoading={true}
        loadingDuration={26}
      />
    </AbsoluteFill>
  );
};
