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
  "Hey team, we're rolling out a new XFN review process for Q2. Please check the updated PSC guidelines before your next EPD sync. The new OKR framework should help us align across orgs.";

// Acronym positions in the text
const XFN_POS = POST_TEXT.indexOf('XFN');
const PSC_POS = POST_TEXT.indexOf('PSC');
const EPD_POS = POST_TEXT.indexOf('EPD');
const OKR_POS = POST_TEXT.indexOf('OKR');

// Layout constants
const BROWSER_X = 120;
const BROWSER_Y = 350;
const BROWSER_W = 1680;

// Approximate XFN position on screen
const XFN_SCREEN_X = BROWSER_X + 470;
const XFN_SCREEN_Y = BROWSER_Y + 210;

export const Feature1Scene: React.FC = () => {
  const frame = useCurrentFrame() - SCENE_DELAY;
  const { fps } = useVideoConfig();

  // ── Pill + Title entrance ──
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

  // Cursor keyframes: enter from bottom-right, then move to XFN
  const cursorKeyframes: [number, number, number][] = [
    [45, BROWSER_X + BROWSER_W - 80, BROWSER_Y + 350],
    [75, XFN_SCREEN_X + 20, XFN_SCREEN_Y + 8],
  ];

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
        <FeaturePill label="FEATURE 1" showAt={0} />
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
          Instant WUT Definitions on Hover
        </h2>
      </div>

      {/* Description */}
      <div
        style={{
          position: 'absolute',
          top: 200,
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
          Hover over any recognized acronym for the top-voted WUT definition.
        </p>
      </div>

      {/* Browser chrome with post */}
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
        <BrowserChrome url="workplace.com/groups/engineering-updates">
          <div
            style={{
              background: tokens.white,
              border: `1px solid ${tokens.zinc200}`,
              borderRadius: 16,
              padding: 32,
              maxWidth: 800,
            }}
          >
            {/* Post header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${tokens.zinc300}, ${tokens.zinc400})`,
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 600,
                    color: tokens.zinc950,
                  }}
                >
                  Alex Zhang
                </div>
                <div style={{ fontSize: 16, color: tokens.zinc400 }}>2h ago</div>
              </div>
            </div>

            {/* Post text with acronym highlights */}
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.75,
                color: tokens.zinc700,
              }}
            >
              <AcronymText
                text={POST_TEXT}
                acronyms={[
                  { word: 'XFN', startIndex: XFN_POS, underlineAt: 25, hoverAt: 75 },
                  { word: 'PSC', startIndex: PSC_POS, underlineAt: 30 },
                  { word: 'EPD', startIndex: EPD_POS, underlineAt: 35 },
                  { word: 'OKR', startIndex: OKR_POS, underlineAt: 40 },
                ]}
              />
            </div>
          </div>
        </BrowserChrome>
      </div>

      {/* Cursor */}
      {frame >= 45 && <Cursor keyframes={cursorKeyframes} />}

      {/* Tooltip */}
      <Tooltip
        term="XFN"
        definition="Cross-functional — referring to collaboration between different teams or disciplines."
        source="wut"
        upvotes={38}
        x={XFN_SCREEN_X - 20}
        y={XFN_SCREEN_Y - 280}
        showAt={80}
        showLoading={true}
        loadingDuration={26}
      />
    </AbsoluteFill>
  );
};
