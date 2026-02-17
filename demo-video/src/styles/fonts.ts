import { loadFont } from '@remotion/google-fonts/Inter';
import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const { fontFamily: handwritingFontFamily } = loadCaveat('normal', {
  weights: ['700'],
  subsets: ['latin'],
});

export { fontFamily, handwritingFontFamily };
