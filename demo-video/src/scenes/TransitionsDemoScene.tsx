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

// ── Shared constants ─────────────────────────────────────────────

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#ef4444', // red
  '#eab308', // yellow
];

// ── Utility: colored card for transition demos ───────────────────

const DemoCard: React.FC<{
  label: string;
  color: string;
  sublabel?: string;
}> = ({ label, color, sublabel }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#ffffff',
          textShadow: '0 2px 12px rgba(0,0,0,0.25)',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.85)',
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          {sublabel}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Section header scene ─────────────────────────────────────────

export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  const subtitleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.zinc950,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: tokens.white,
            margin: 0,
            textAlign: 'center',
          }}
        >
          {title}
        </h1>
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            marginTop: 20,
          }}
        >
          <p
            style={{
              fontSize: 36,
              color: tokens.zinc400,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {subtitle}
          </p>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Spring Configs Demo ──────────────────────────────────────────

export const SpringConfigsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const configs = [
    { label: 'Smooth', config: { damping: 200 }, color: COLORS[0] },
    { label: 'Snappy', config: { damping: 20, stiffness: 200 }, color: COLORS[1] },
    { label: 'Bouncy', config: { damping: 8 }, color: COLORS[2] },
    { label: 'Heavy', config: { damping: 15, stiffness: 80, mass: 2 }, color: COLORS[3] },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f3f6fc',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: tokens.zinc950,
          marginBottom: 60,
          textAlign: 'center',
        }}
      >
        Spring Configurations
      </div>
      <div
        style={{
          display: 'flex',
          gap: 48,
          alignItems: 'flex-end',
        }}
      >
        {configs.map((item, i) => {
          const progress = spring({
            frame: frame - i * 12,
            fps,
            config: item.config,
          });
          const scale = interpolate(progress, [0, 1], [0, 1]);
          const y = interpolate(progress, [0, 1], [200, 0]);

          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 24,
                  backgroundColor: item.color,
                  transform: `translateY(${y}px) scale(${scale})`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                }}
              />
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: tokens.zinc700,
                  opacity: interpolate(progress, [0, 0.5], [0, 1], {
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Easing Curves Demo ───────────────────────────────────────────

export const EasingCurvesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const duration = 2 * fps; // 2 seconds for the animation
  const loopFrame = frame % (duration + fps); // add 1s pause between loops

  const easings: { label: string; fn: (t: number) => number }[] = [
    { label: 'Linear', fn: Easing.linear },
    { label: 'Ease In (quad)', fn: Easing.in(Easing.quad) },
    { label: 'Ease Out (quad)', fn: Easing.out(Easing.quad) },
    { label: 'Ease InOut (cubic)', fn: Easing.inOut(Easing.cubic) },
    { label: 'Ease InOut (circle)', fn: Easing.inOut(Easing.circle) },
    { label: 'Bezier (bounce-like)', fn: Easing.bezier(0.68, -0.55, 0.27, 1.55) },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f3f6fc',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: tokens.zinc950,
          marginBottom: 50,
          textAlign: 'center',
        }}
      >
        Easing Curves
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          width: '100%',
          maxWidth: 1400,
        }}
      >
        {easings.map((item, i) => {
          const x = interpolate(loopFrame, [0, duration], [0, 1], {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
            easing: item.fn,
          });

          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: tokens.zinc700,
                  width: 280,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: tokens.zinc200,
                  borderRadius: 4,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${x * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: COLORS[i % COLORS.length],
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Stagger Animation Demo ───────────────────────────────────────

export const StaggerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    'Fade Up', 'Scale In', 'Slide Right', 'Rotate In',
    'Flip In', 'Bounce', 'Elastic', 'Pop',
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f3f6fc',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: tokens.zinc950,
          marginBottom: 50,
        }}
      >
        Staggered Entrances
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          justifyContent: 'center',
          maxWidth: 900,
        }}
      >
        {items.map((item, i) => {
          const delay = i * 6;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 120 },
          });
          const opacity = interpolate(progress, [0, 0.5], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const y = interpolate(progress, [0, 1], [60, 0]);
          const scale = interpolate(progress, [0, 1], [0.7, 1]);

          return (
            <div
              key={item}
              style={{
                width: 190,
                height: 100,
                borderRadius: 16,
                backgroundColor: COLORS[i % COLORS.length],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                fontWeight: 600,
                color: '#ffffff',
                opacity,
                transform: `translateY(${y}px) scale(${scale})`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Typewriter Demo ──────────────────────────────────────────────

export const TypewriterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fullText = 'Remotion makes video creation feel like coding.';
  const charFrames = 2;
  const typedChars = Math.min(fullText.length, Math.floor(frame / charFrames));
  const typedText = fullText.slice(0, typedChars);

  // Blinking cursor
  const cursorBlink = 16;
  const cursorOpacity = interpolate(
    frame % cursorBlink,
    [0, cursorBlink / 2, cursorBlink],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.zinc950,
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 120,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: tokens.white,
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        <span>{typedText}</span>
        <span style={{ opacity: cursorOpacity, color: COLORS[0] }}>{'\u258C'}</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Word Highlight Demo ──────────────────────────────────────────

export const WordHighlightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ['Transitions', 'Animations', 'Springs', 'Easing'];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f3f6fc',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: tokens.zinc950,
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        {'Remotion supports '}
        {words.map((word, i) => {
          const delay = 20 + i * 20;
          const progress = spring({
            fps,
            frame,
            config: { damping: 200 },
            delay,
            durationInFrames: 18,
          });
          const scaleX = Math.max(0, Math.min(1, progress));

          return (
            <React.Fragment key={word}>
              {i > 0 && (i === words.length - 1 ? ' & ' : ', ')}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: -4,
                    right: -4,
                    top: '50%',
                    height: '1.05em',
                    transform: `translateY(-50%) scaleX(${scaleX})`,
                    transformOrigin: 'left center',
                    backgroundColor: COLORS[i % COLORS.length] + '40',
                    borderRadius: '0.18em',
                    zIndex: 0,
                  }}
                />
                <span style={{ position: 'relative', zIndex: 1, color: COLORS[i % COLORS.length] }}>
                  {word}
                </span>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Combined Transform Demo ──────────────────────────────────────

export const CombinedTransformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const rotation = interpolate(progress, [0, 1], [0, 360]);
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const borderRadius = interpolate(progress, [0, 1], [0, 40]);

  // Orbiting dots
  const orbitRadius = 220;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f3f6fc',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: tokens.zinc950,
          position: 'absolute',
          top: 80,
          textAlign: 'center',
          width: '100%',
        }}
      >
        Combined Transforms
      </div>

      {/* Central spinning/scaling square */}
      <div
        style={{
          width: 140,
          height: 140,
          backgroundColor: COLORS[0],
          transform: `rotate(${rotation}deg) scale(${scale})`,
          borderRadius,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      />

      {/* Orbiting dots */}
      {COLORS.slice(0, 6).map((color, i) => {
        const angle = (i / 6) * Math.PI * 2 + (frame / 30) * Math.PI * 2;
        const x = Math.cos(angle) * orbitRadius;
        const y = Math.sin(angle) * orbitRadius;
        const dotScale = interpolate(
          spring({ frame: frame - i * 4, fps, config: { damping: 15 } }),
          [0, 1],
          [0, 1],
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: color,
              transform: `translate(${x}px, ${y}px) scale(${dotScale})`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Scale & Rotate In/Out Demo ───────────────────────────────────

export const ScaleRotateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const inProgress = spring({ frame, fps, config: { damping: 12 } });
  const outProgress = spring({
    frame,
    fps,
    delay: durationInFrames - fps,
    durationInFrames: fps,
  });

  const scale = interpolate(inProgress - outProgress, [0, 1], [0, 1]);
  const rotate = interpolate(inProgress - outProgress, [0, 1], [-180, 0]);
  const opacity = interpolate(inProgress - outProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.zinc950,
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: tokens.white,
          position: 'absolute',
          top: 80,
          textAlign: 'center',
          width: '100%',
        }}
      >
        Enter & Exit Animations
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: tokens.white,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          opacity,
          textShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        Hello!
      </div>
    </AbsoluteFill>
  );
};

// ── Progress Bar / Loading Demo ──────────────────────────────────

export const ProgressBarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 30], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const percentage = Math.round(progress * 100);

  // Counter spring for the percentage display
  const counterScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f3f6fc',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 200,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: tokens.zinc950,
          marginBottom: 40,
        }}
      >
        Interpolation + Easing
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: 40,
          backgroundColor: tokens.zinc200,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS[0]}, ${COLORS[1]})`,
            borderRadius: 20,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: COLORS[0],
          marginTop: 40,
          transform: `scale(${counterScale})`,
        }}
      >
        {percentage}%
      </div>
    </AbsoluteFill>
  );
};
