import { Composition } from 'remotion';
import { Video } from './Video';

// Total duration: 100 + 240 + 240 + 180 - 15 - 25 - 15 = 705 frames (~23.5s)
const TOTAL_DURATION = 705;

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
