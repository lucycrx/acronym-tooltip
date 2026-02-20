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
import { AnimatedBackground } from '../components/AnimatedBackground';
import { BrowserChrome } from '../components/BrowserChrome';
import { AcronymText } from '../components/AcronymText';
import { Cursor } from '../components/Cursor';
import { Tooltip } from '../components/Tooltip';
import { FeaturePill } from '../components/FeaturePill';

const SCENE_DELAY = 30;

const POST_TEXT =
  '...make sure you file a TEA request before proceeding with the migration...';

const TEA_POS = POST_TEXT.indexOf('TEA');

const AI_DEFINITION =
  'Technical Execution Approval — an internal process for reviewing and approving significant engineering changes or migrations.';

// Layout constants
const BROWSER_X = 120;
const BROWSER_Y = 440;
const BROWSER_W = 1680;

// Approximate TEA position on screen
const TEA_SCREEN_X = BROWSER_X + 400;
const TEA_SCREEN_Y = BROWSER_Y + 120;

export const Feature2Scene: React.FC = () => {
  const frame = useCurrentFrame() - SCENE_DELAY;
  const { fps } = useVideoConfig();

  // ── Title entrance ──
  const titleProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleProgress, [0, 1], [15, 0]);

  const descProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const descOpacity = interpolate(descProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const descY = interpolate(descProgress, [0, 1], [12, 0]);

  // ── Browser card spring ──
  const browserProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const browserOpacity = interpolate(browserProgress, [0, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const browserY = interpolate(browserProgress, [0, 1], [30, 0]);

  // Cursor keyframes: enter from bottom-right, then move to TEA
  const cursorKeyframes: [number, number, number][] = [
    [45, BROWSER_X + BROWSER_W - 80, BROWSER_Y + 250],
    [68, TEA_SCREEN_X + 20, TEA_SCREEN_Y + 8],
  ];

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AnimatedBackground />

      {/* Feature pill */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FeaturePill
          label="FEATURE 2"
          showAt={0}
          color={tokens.white}
          bgColor={tokens.purple}
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 0,
          right: 0,
          textAlign: 'center' as const,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: tokens.zinc950,
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          AI-Generated Definitions When WUT Has No Entry
        </h2>
      </div>

      {/* Description */}
      <div
        style={{
          position: 'absolute',
          top: 330,
          left: 0,
          right: 0,
          textAlign: 'center' as const,
          opacity: descOpacity,
          transform: `translateY(${descY}px)`,
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: tokens.zinc500,
            margin: 0,
          }}
        >
          AI uses page context to generate a definition when WUT has no entry.
        </p>
      </div>

      {/* Browser chrome with AI tooltip */}
      <div
        style={{
          position: 'absolute',
          left: BROWSER_X,
          top: BROWSER_Y,
          width: BROWSER_W,
          opacity: browserOpacity,
          transform: `translateY(${browserY}px)`,
        }}
      >
        <BrowserChrome url="internalfb.com/wiki/eng-team">
          <div
            style={{
              fontSize: 26,
              color: tokens.zinc700,
              lineHeight: 1.75,
            }}
          >
            <AcronymText
              text={POST_TEXT}
              acronyms={[
                { word: 'TEA', startIndex: TEA_POS, underlineAt: 40, hoverAt: 70 },
              ]}
            />
          </div>
        </BrowserChrome>
      </div>

      {/* AI tooltip (outside browser to avoid overflow clipping) */}
      <Tooltip
        term="TEA"
        definition={AI_DEFINITION}
        source="ai"
        x={BROWSER_X + 144}
        y={BROWSER_Y + 122}
        showAt={76}
        showLoading={true}
        loadingDuration={30}
      />

      {/* Cursor */}
      {frame >= 45 && <Cursor keyframes={cursorKeyframes} />}
    </AbsoluteFill>
  );
};
