// Shared constants for Acronym Tooltip extension

// Common English words that match the acronym regex but aren't acronyms
const ACT_STOPWORDS = new Set([
  'THE', 'AND', 'FOR', 'BUT', 'NOT', 'ALL', 'HAS', 'ARE', 'WAS', 'HIS',
  'HER', 'HIM', 'WHO', 'HOW', 'MAY', 'CAN', 'DID', 'GET', 'HAS', 'HAD',
  'LET', 'SAY', 'SHE', 'TOO', 'USE', 'WAY', 'ANY', 'NEW', 'NOW', 'OLD',
  'SEE', 'OUR', 'OUT', 'OWN', 'PUT', 'RUN', 'SET', 'TRY', 'WHY', 'ADD',
  'AGE', 'AGO', 'AID', 'AIM', 'AIR', 'ASK', 'ATE', 'BAD', 'BAR', 'BED',
  'BIG', 'BIT', 'BOX', 'BOY', 'BUS', 'BUY', 'CAR', 'CUT', 'DAY', 'DOG',
  'EAR', 'EAT', 'END', 'EYE', 'FAR', 'FEW', 'FIT', 'FLY', 'GOD', 'GOT',
  'GUN', 'GUY', 'HOT', 'ICE', 'ILL', 'JOB', 'KEY', 'KID', 'LAW', 'LAY',
  'LED', 'LEG', 'LIE', 'LOT', 'LOW', 'MAP', 'MEN', 'MET', 'MIX', 'NOR',
  'OIL', 'PAY', 'PER', 'RED', 'RAN', 'ROW', 'SAT', 'SIT', 'SIX', 'SKY',
  'SON', 'TEN', 'TOP', 'TWO', 'WAR', 'WAS', 'WET', 'WIN', 'WON', 'YET',
  'YES', 'YOU', 'ALSO', 'JUST', 'LIKE', 'WILL', 'WITH', 'BEEN', 'COME',
  'DOES', 'DONE', 'EACH', 'EVEN', 'EVER', 'FROM', 'GAVE', 'GOES', 'GONE',
  'GOOD', 'GREW', 'GROW', 'HAVE', 'HEAD', 'HELP', 'HERE', 'HIGH', 'HOME',
  'INTO', 'KEEP', 'KIND', 'KNEW', 'KNOW', 'LAND', 'LAST', 'LEFT', 'LIFE',
  'LINE', 'LIST', 'LONG', 'LOOK', 'LOST', 'MADE', 'MAKE', 'MANY', 'MORE',
  'MOST', 'MUCH', 'MUST', 'NAME', 'NEAR', 'NEED', 'NEXT', 'NOTE', 'ONCE',
  'ONLY', 'OPEN', 'OVER', 'PAGE', 'PART', 'PAST', 'PICK', 'PLAN', 'PLAY',
  'PULL', 'PUSH', 'READ', 'REAL', 'REST', 'SAID', 'SAME', 'SAVE', 'SEEN',
  'SELF', 'SEND', 'SHOW', 'SHUT', 'SIDE', 'SIGN', 'SOME', 'SOON', 'SORT',
  'STAY', 'STEP', 'STOP', 'SUCH', 'SURE', 'TAKE', 'TALK', 'TELL', 'THAN',
  'THAT', 'THEM', 'THEN', 'THEY', 'THIS', 'THUS', 'TILL', 'TIME', 'TOLD',
  'TOOK', 'TURN', 'TYPE', 'UPON', 'VERY', 'WANT', 'WEEK', 'WELL', 'WENT',
  'WERE', 'WHAT', 'WHEN', 'WHOM', 'WIDE', 'WISH', 'WORD', 'WORK', 'YEAR',
  'YOUR', 'ZERO',
  // Single letters and two-letter words that slip through
  'AM', 'AN', 'AS', 'AT', 'BE', 'BY', 'DO', 'GO', 'HE', 'IF', 'IN',
  'IS', 'IT', 'ME', 'MY', 'NO', 'OF', 'OK', 'ON', 'OR', 'SO', 'TO',
  'UP', 'US', 'WE',
]);

// Design tokens matching Zinc palette
const ACT_TOKENS = {
  zinc50: '#fafafa',
  zinc100: '#f4f4f5',
  zinc200: '#e4e4e7',
  zinc400: '#a1a1aa',
  zinc500: '#71717a',
  zinc700: '#3f3f46',
  zinc950: '#09090b',
  white: '#ffffff',
  shadow: '0 4px 24px rgba(0,0,0,0.08)',
  radius: '16px',
  radiusFull: '9999px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

// Cache TTLs
const ACT_CACHE_TTL = {
  wut: 24 * 60 * 60 * 1000,   // 24 hours
  ai: 4 * 60 * 60 * 1000,     // 4 hours
  dtsg: 60 * 60 * 1000,       // 1 hour
};

// Acronym regex: 2-8 uppercase letters
const ACT_ACRONYM_REGEX = /\b[A-Z]{2,8}\b/g;

// Tags to skip when walking the DOM
const ACT_SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'SELECT',
  'BUTTON', 'SVG', 'CANVAS', 'IFRAME', 'NOSCRIPT', 'KBD', 'SAMP',
]);

// Maximum definitions to show in "Other definitions" section
const ACT_MAX_OTHER_DEFS = 3;

// Debounce delay for MutationObserver
const ACT_OBSERVER_DEBOUNCE_MS = 100;

// Delay before showing tooltip on hover (ms)
const ACT_TOOLTIP_SHOW_DELAY = 200;

// Delay before hiding tooltip when mouse leaves (ms) — allows moving into tooltip
const ACT_TOOLTIP_HIDE_DELAY = 300;
