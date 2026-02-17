import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { tokens } from '../styles/tokens';
import { fontFamily } from '../styles/fonts';
import { AcronymText } from '../components/AcronymText';
import { Cursor } from '../components/Cursor';
import { Tooltip } from '../components/Tooltip';
import { Callout } from '../components/Callout';

const POST_TEXT =
  'Bumped into some Google Drive unmounting issues when trying out PARA Workspace and got the fix from Amanda. Several posts going around also pointing to the issue.';

const PARA_POS = POST_TEXT.indexOf('PARA');

const CARD_X = 360;
const CARD_Y = 280;
const CARD_W = 1200;

const ACRONYM_SCREEN_X = CARD_X + 580;
const ACRONYM_SCREEN_Y = CARD_Y + 85;

const AI_DEFINITION =
  'Projects, Areas, Resources, Archives. A digital organization system developed by Tiago Forte that categorizes information based on actionability rather than topic.';

export const AiFallbackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing (180 frames = 6s)
  // 0-15: Card appears
  // 15-30: PARA gets underline
  // 25-50: Cursor moves to PARA
  // 55-61: Tooltip appears with loading
  // 61-82: Loading
  // 82+: AI definition shown
  // 120+: Callout

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

  const cursorKeyframes: [number, number, number][] = [
    [20, CARD_X + CARD_W - 100, CARD_Y + 180],
    [48, ACRONYM_SCREEN_X + 15, ACRONYM_SCREEN_Y + 8],
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
                Claude Code Community
              </div>
              <div style={{ fontSize: 11, color: tokens.zinc400 }}>
                Workplace · 5h ago
              </div>
            </div>
          </div>

          {/* Post text */}
          <div style={{ fontSize: 18, lineHeight: 1.65, color: tokens.zinc950 }}>
            <AcronymText
              text={POST_TEXT}
              acronyms={[
                {
                  word: 'PARA',
                  startIndex: PARA_POS,
                  underlineAt: 15,
                  hoverAt: 45,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Cursor */}
      {frame >= 20 && (
        <Cursor keyframes={cursorKeyframes} />
      )}

      {/* Tooltip with AI source */}
      <Tooltip
        term="PARA"
        definition={AI_DEFINITION}
        source="ai"
        x={ACRONYM_SCREEN_X - 80}
        y={ACRONYM_SCREEN_Y - 185}
        showAt={55}
        showLoading={true}
        loadingDuration={27}
      />

      {/* Callout */}
      <Callout
        label="No WUT entry? AI fills the gap"
        x={ACRONYM_SCREEN_X + 310}
        y={ACRONYM_SCREEN_Y - 190}
        targetX={ACRONYM_SCREEN_X + 50}
        targetY={ACRONYM_SCREEN_Y - 170}
        showAt={120}
        color={tokens.purple}
      />
    </AbsoluteFill>
  );
};
