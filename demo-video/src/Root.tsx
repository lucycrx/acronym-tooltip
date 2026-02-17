import { Composition } from 'remotion';
import { Video } from './Video';

// Total duration: 90 + 450 + 210 + 150 - 15 - 15 - 15 = 855 frames (~28.5s)
const TOTAL_DURATION = 855;

export const RemotionRoot = () => {
  return (
    <Composition
      id="Video"
      component={Video}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
