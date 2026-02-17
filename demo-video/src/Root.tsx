import { Composition } from 'remotion';
import { Video } from './Video';
import { TransitionsDemo } from './TransitionsDemo';

// Total duration: 100 + 240 + 240 + 180 - 15 - 25 - 15 = 705 frames (~23.5s)
const TOTAL_DURATION = 705;

// TransitionsDemo: 2250 sequence frames - 630 transition overlap = 1620 frames (~54s)
const TRANSITIONS_DEMO_DURATION = 1620;

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
    </>
  );
};
