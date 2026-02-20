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
import { Tooltip } from '../components/Tooltip';
import { NoDefinitionTooltip } from '../components/NoDefinitionTooltip';
import { FeaturePill } from '../components/FeaturePill';
import { Callout } from '../components/Callout';

const SCENE_DELAY = 30;

const POST_TEXT =
  '...make sure you file a TEA request before proceeding with the migration...';

const TEA_POS = POST_TEXT.indexOf('TEA');

const AI_DEFINITION =
  'Technical Execution Approval — an internal process for reviewing and approving significant engineering changes or migrations.';

// Layout constants
const COL_LEFT_X = 80;
const COL_RIGHT_X = 980;
const COL_W = 840;
const COL_Y = 380;

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

  // ── Left column spring ──
  const leftProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const leftOpacity = interpolate(leftProgress, [0, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const leftY = interpolate(leftProgress, [0, 1], [30, 0]);

  // ── Right column spring (staggered) ──
  const rightProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const rightOpacity = interpolate(rightProgress, [0, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightY = interpolate(rightProgress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AnimatedBackground />

      {/* Feature pill */}
      <div
        style={{
          position: 'absolute',
          top: 60,
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
          top: 130,
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
          top: 205,
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

      {/* Column labels */}
      <div
        style={{
          position: 'absolute',
          top: COL_Y - 40,
          left: COL_LEFT_X,
          fontSize: 18,
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          color: tokens.zinc400,
          opacity: leftOpacity,
        }}
      >
        With API key configured
      </div>
      <div
        style={{
          position: 'absolute',
          top: COL_Y - 40,
          left: COL_RIGHT_X,
          fontSize: 18,
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          color: tokens.zinc400,
          opacity: rightOpacity,
        }}
      >
        Without API key
      </div>

      {/* Left column — AI tooltip */}
      <div
        style={{
          position: 'absolute',
          left: COL_LEFT_X,
          top: COL_Y,
          width: COL_W,
          opacity: leftOpacity,
          transform: `translateY(${leftY}px)`,
        }}
      >
        <BrowserChrome url="internalfb.com/wiki/eng-team">
          <div
            style={{
              fontSize: 20,
              color: tokens.zinc700,
              lineHeight: 1.7,
            }}
          >
            <AcronymText
              text={POST_TEXT}
              acronyms={[
                { word: 'TEA', startIndex: TEA_POS, underlineAt: 40, hoverAt: 70 },
              ]}
            />
          </div>

          {/* AI tooltip within browser */}
          <Tooltip
            term="TEA"
            definition={AI_DEFINITION}
            source="ai"
            x={120}
            y={60}
            showAt={76}
            showLoading={true}
            loadingDuration={30}
          />
        </BrowserChrome>
      </div>

      {/* Right column — No definition tooltip */}
      <div
        style={{
          position: 'absolute',
          left: COL_RIGHT_X,
          top: COL_Y,
          width: COL_W,
          opacity: rightOpacity,
          transform: `translateY(${rightY}px)`,
        }}
      >
        <BrowserChrome url="internalfb.com/wiki/eng-team">
          <div
            style={{
              fontSize: 20,
              color: tokens.zinc700,
              lineHeight: 1.7,
            }}
          >
            <AcronymText
              text={POST_TEXT}
              acronyms={[
                { word: 'TEA', startIndex: TEA_POS, underlineAt: 50, hoverAt: 76 },
              ]}
            />
          </div>

          {/* No definition tooltip within browser */}
          <NoDefinitionTooltip term="TEA" x={120} y={60} showAt={80} />
        </BrowserChrome>
      </div>

      {/* Callout */}
      <Callout
        label='AI shows purple "AI-generated" badge'
        x={480}
        y={950}
        targetX={COL_LEFT_X + 350}
        targetY={COL_Y + 180}
        showAt={140}
        color={tokens.purple}
      />
    </AbsoluteFill>
  );
};
