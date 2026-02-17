import { Composition } from 'remotion';
import { Video } from './Video';

// Total duration: 90 + 180 + 180 + 150 - 15 - 15 - 15 = 555 frames (~18.5s)
const TOTAL_DURATION = 555;

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
