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
  'Bumped into some Google Drive unmounting issues when trying out PARA Workspace and got the fix from Amanda. Several posts going around also pointing to the issue.';

const PARA_POS = POST_TEXT.indexOf('PARA');

// Card position constants — large card, centered
const CARD_X = 160;
const CARD_Y = 660;
const CARD_W = 1600;

// Acronym position on screen (approximate for PARA in the card)
// "Bumped into some Google Drive unmounting issues when trying out " = 64 chars, ~14.7px avg at 30px Inter
const ACRONYM_SCREEN_X = CARD_X + 1000;
const ACRONYM_SCREEN_Y = CARD_Y + 140;

const AI_DEFINITION =
  'Projects, Areas, Resources, Archives. A digital organization system developed by Tiago Forte that categorizes information based on actionability rather than topic.';

export const AiFallbackScene: React.FC = () => {
  // Delay all animations so content appears after the incoming transition settles
  const SCENE_DELAY = 30;
  const frame = useCurrentFrame() - SCENE_DELAY;
  const { fps } = useVideoConfig();

  // Timing (210 frames = 7s)
  // 0-15: Card appears
  // 15-35: PARA gets underline
  // 30-65: Cursor moves to PARA
  // 68-74: Tooltip appears with loading
  // 74-100: Loading
  // 100+: AI definition shown

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

  const cursorKeyframes: [number, number, number][] = [
    [25, CARD_X + CARD_W - 100, CARD_Y + 250],
    [60, ACRONYM_SCREEN_X + 20, ACRONYM_SCREEN_Y + 10],
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
          When a definition does not exist,
          <br />
          AI generates one with page context
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
                Claude Code Community
              </div>
              <div style={{ fontSize: 17, color: tokens.zinc400 }}>
                Workplace · 5h ago
              </div>
            </div>
          </div>

          {/* Post text */}
          <div style={{ fontSize: 30, lineHeight: 1.65, color: tokens.zinc950 }}>
            <AcronymText
              text={POST_TEXT}
              acronyms={[
                {
                  word: 'PARA',
                  startIndex: PARA_POS,
                  underlineAt: 20,
                  hoverAt: 58,
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
      {frame >= 25 && (
        <Cursor keyframes={cursorKeyframes} />
      )}

      {/* Tooltip with AI source */}
      <Tooltip
        term="PARA"
        definition={AI_DEFINITION}
        source="ai"
        x={ACRONYM_SCREEN_X - 100}
        y={ACRONYM_SCREEN_Y - 400}
        showAt={68}
        showLoading={true}
        loadingDuration={30}
      />
    </AbsoluteFill>
  );
};
