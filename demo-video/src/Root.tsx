import { Composition } from 'remotion';
import { Video } from './Video';

// Total duration: 90 + 210 + 210 + 150 - 15 - 15 - 15 = 615 frames (~20.5s)
const TOTAL_DURATION = 615;

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
