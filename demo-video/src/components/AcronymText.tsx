import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { tokens } from '../styles/tokens';

type AcronymHighlight = {
  word: string;
  startIndex: number;
  underlineAt: number;
  hoverAt?: number;
};

type AcronymTextProps = {
  text: string;
  acronyms: AcronymHighlight[];
  style?: React.CSSProperties;
};

export const AcronymText: React.FC<AcronymTextProps> = ({ text, acronyms, style }) => {
  const frame = useCurrentFrame();

  // Build segments from text with acronym markers
  const segments: { text: string; acronym?: AcronymHighlight }[] = [];
  let lastIndex = 0;

  // Sort acronyms by startIndex
  const sorted = [...acronyms].sort((a, b) => a.startIndex - b.startIndex);

  for (const acr of sorted) {
    if (acr.startIndex > lastIndex) {
      segments.push({ text: text.slice(lastIndex, acr.startIndex) });
    }
    segments.push({ text: acr.word, acronym: acr });
    lastIndex = acr.startIndex + acr.word.length;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return (
    <span style={style}>
      {segments.map((seg, i) => {
        if (!seg.acronym) {
          return <span key={i}>{seg.text}</span>;
        }

        const acr = seg.acronym;
        const relFrame = frame - acr.underlineAt;

        // Underline fade in
        const underlineOpacity = interpolate(relFrame, [0, 12], [0, 1], {
          extrapolateRight: 'clamp',
          extrapolateLeft: 'clamp',
          easing: Easing.inOut(Easing.quad),
        });

        // Hover state darkens underline
        const isHovered = acr.hoverAt !== undefined && frame >= acr.hoverAt;
        const borderColor = isHovered ? tokens.zinc700 : tokens.zinc400;

        return (
          <span
            key={i}
            style={{
              borderBottom: `1px dotted ${borderColor}`,
              borderBottomWidth: 1,
              opacity: 1,
              // Use a clip path for the underline reveal
              borderBottomColor: borderColor,
              // Animate the underline appearance via opacity on the border
              borderBottomStyle: 'dotted' as const,
              paddingBottom: 1,
              // Animate border visibility
              ...(underlineOpacity < 1
                ? {
                    borderImage: `linear-gradient(to right, ${borderColor} ${underlineOpacity * 100}%, transparent ${underlineOpacity * 100}%) 1`,
                  }
                : {}),
            }}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
};
