import { Composition } from 'remotion';
import { Video } from './Video';
import { TransitionsDemo } from './TransitionsDemo';
import { FeatureShowcase } from './FeatureShowcase';
import { HeaderImage } from './HeaderImage';

// Total duration: 100 + 240 + 240 + 180 - 15 - 25 - 15 = 705 frames (~23.5s)
const TOTAL_DURATION = 705;

// TransitionsDemo: 2250 sequence frames - 630 transition overlap = 1620 frames (~54s)
const TRANSITIONS_DEMO_DURATION = 1620;

// FeatureShowcase: 120 + 240 + 210 + 210 + 120 - 15 - 20 - 20 - 15 = 830 frames (~27.7s)
const FEATURE_SHOWCASE_DURATION = 830;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Video"
        component={Video}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TransitionsDemo"
        component={TransitionsDemo}
        durationInFrames={TRANSITIONS_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FeatureShowcase"
        component={FeatureShowcase}
        durationInFrames={FEATURE_SHOWCASE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeaderImage"
        component={HeaderImage}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={630}
      />
    </>
  );
};
