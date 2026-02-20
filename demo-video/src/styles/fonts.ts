import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export { fontFamily };
