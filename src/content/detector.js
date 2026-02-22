// Acronym Tooltip — Acronym Detector (Content Script)
// Scans the DOM for acronyms, highlights them via CSS Custom Highlight API,
// and watches for new content. Does NOT modify the DOM structure to avoid
// breaking React/framework-managed pages.

(function () {
  'use strict';

  // ── Constants (inlined to avoid module issues in content scripts) ──────────

  const ACRONYM_REGEX = /\b[A-Z]{2,6}\b/g;
  const OBSERVER_DEBOUNCE_MS = 100;

  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'SELECT',
    'BUTTON', 'SVG', 'CANVAS', 'IFRAME', 'NOSCRIPT', 'KBD', 'SAMP',
  ]);

  const STOPWORDS = new Set([
    'THE', 'AND', 'FOR', 'BUT', 'NOT', 'ALL', 'HAS', 'ARE', 'WAS', 'HIS',
    'HER', 'HIM', 'WHO', 'HOW', 'MAY', 'CAN', 'DID', 'GET', 'HAD',
    'LET', 'SAY', 'SHE', 'TOO', 'USE', 'WAY', 'ANY', 'NEW', 'NOW', 'OLD',
    'SEE', 'OUR', 'OUT', 'OWN', 'PUT', 'RUN', 'SET', 'TRY', 'WHY', 'ADD',
    'AGE', 'AGO', 'AID', 'AIM', 'AIR', 'ASK', 'ATE', 'BAD', 'BAR', 'BED',
    'BIG', 'BIT', 'BOX', 'BOY', 'BUS', 'BUY', 'CAR', 'CUT', 'DAY', 'DOG',
    'EAR', 'EAT', 'END', 'EYE', 'FAR', 'FEW', 'FIT', 'FLY', 'GOD', 'GOT',
    'GUN', 'GUY', 'HOT', 'ICE', 'ILL', 'JOB', 'KEY', 'KID', 'LAW', 'LAY',
    'LED', 'LEG', 'LIE', 'LOT', 'LOW', 'MAP', 'MEN', 'MET', 'MIX', 'NOR',
    'OIL', 'PAY', 'PER', 'RED', 'RAN', 'ROW', 'SAT', 'SIT', 'SIX', 'SKY',
    'SON', 'TEN', 'TOP', 'TWO', 'WAR', 'WET', 'WIN', 'WON', 'YET',
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
    'AM', 'AN', 'AS', 'AT', 'BE', 'BY', 'DO', 'GO', 'HE', 'IF', 'IN',
    'IS', 'IT', 'ME', 'MY', 'NO', 'OF', 'OK', 'ON', 'OR', 'SO', 'TO',
    'UP', 'US', 'WE',
    // UI actions and labels commonly found as button/link text
    'EDIT', 'VIEW', 'CLICK', 'CLOSE', 'SHARE', 'APPLY', 'DRAFT',
    'LEARN', 'REPLY', 'PRINT', 'RESET', 'LOGIN', 'MENU', 'MUTE',
    'HIDE', 'LOCK', 'DENY', 'POST', 'UNDO', 'REDO', 'MOVE', 'FIND',
    'CALL', 'BACK', 'FULL', 'COPY', 'PASTE', 'TLDR',
    // Common English words that frequently appear in all-caps headings
    'FREE', 'SALE', 'LIVE', 'WATCH', 'FINAL', 'ABOUT', 'FIRST',
    'AFTER', 'AGAIN', 'OTHER', 'THEIR', 'THERE', 'THESE', 'THOSE',
    'WHICH', 'WHILE', 'WOULD', 'COULD', 'EVERY', 'UNDER', 'STILL',
    'GREAT', 'SMALL', 'LARGE', 'EARLY', 'NEVER', 'BEING', 'WHERE',
    'SINCE', 'UNTIL', 'ABOVE', 'BELOW', 'WHOLE', 'MIGHT', 'SHALL',
    'OFTEN', 'LATER', 'GIVEN', 'START', 'PLACE', 'POINT', 'PRESS',
    'THINK', 'TODAY', 'TOTAL', 'VALUE', 'WORLD', 'WRITE', 'PRICE',
    'STORE', 'CHECK', 'ENTER', 'OFFER', 'ORDER', 'POWER', 'RAISE',
    'REACH', 'READY', 'RIGHT', 'SHORT', 'SPACE', 'STAND', 'STATE',
    'STORY', 'STUDY', 'TABLE', 'THING', 'THREE', 'TRADE', 'USING',
    'VIDEO', 'VOICE', 'WATER', 'YOUNG',
  ]);

  // Common English suffixes — words ending in these are almost never acronyms
  const ENGLISH_SUFFIXES = [
    'ING', 'TION', 'SION', 'MENT', 'NESS', 'ABLE', 'IBLE',
    'ATED', 'ALLY', 'ISED', 'IZED', 'EOUS', 'IOUS',
  ];

  // ── Shared state namespace ────────────────────────────────────────────────

  window.__ACT = window.__ACT || {};
  window.__ACT.dismissedTerms = new Set();
  window.__ACT.disabledSites = new Set();

  // Map of Range objects keyed by a unique id, for hover detection
  // Each entry: { range: Range, term: string, textNode: Node }
  /** @type {Array<{range: Range, term: string, textNode: Node}>} */
  const acronymRanges = [];
  window.__ACT.acronymRanges = acronymRanges;

  // CSS Custom Highlight for underlines
  let highlightObj = null;

  // ── Utility ───────────────────────────────────────────────────────────────

  function isAcronym(word) {
    if (word.length < 2 || word.length > 6 || !/^[A-Z]+$/.test(word)) return false;
    if (STOPWORDS.has(word)) return false;
    // Words ending in common English suffixes are regular words, not acronyms
    if (word.length >= 5 && ENGLISH_SUFFIXES.some(s => word.endsWith(s))) return false;
    return true;
  }

  /** Returns true if the match is part of a "TL;DR" pattern (any case mix). */
  function isPartOfTLDR(text, start, end) {
    const word = text.slice(start, end);
    if (word === 'TL') return /^;dr/i.test(text.slice(end, end + 3));
    if (word === 'DR') return /tl;$/i.test(text.slice(Math.max(0, start - 3), start));
    return false;
  }

  /**
   * Returns true if a short all-caps word (2–3 chars) appears to be a person's
   * name initials rather than an acronym.
   */
  function isLikelyName(text, matchStart, matchEnd) {
    if (matchEnd - matchStart > 3) return false;
    if (/^\s[A-Z][a-z]{2,}/.test(text.slice(matchEnd, matchEnd + 20))) return true;
    const before = text.slice(Math.max(0, matchStart - 20), matchStart);
    const prev = /([A-Z][a-z]{2,})\s$/.exec(before);
    if (prev && !STOPWORDS.has(prev[1].toUpperCase())) return true;
    return false;
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    let el = node.parentElement;
    // Skip text that appears uppercase due to CSS text-transform
    try {
      if (getComputedStyle(el).textTransform === 'uppercase') return true;
    } catch (e) {
      // getComputedStyle may fail for detached nodes
    }
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.hasAttribute && el.hasAttribute('contenteditable')) return true;
      el = el.parentElement;
    }
    return false;
  }

  // ── DOM scanning (non-destructive) ──────────────────────────────────────

  /** Returns true if the text is predominantly uppercase (heading, label, etc.) */
  function isAllCapsContext(text) {
    let upper = 0;
    let lower = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c >= 65 && c <= 90) upper++;
      else if (c >= 97 && c <= 122) lower++;
    }
    const total = upper + lower;
    if (total < 8) return false;
    return upper / total > 0.7;
  }

  function hasAdjacentCapsWord(text, matchStart, matchEnd) {
    const before = text.slice(0, matchStart);
    if (/\b[A-Z]{2,}\b\s*$/.test(before)) return true;
    const after = text.slice(matchEnd);
    if (/^\s*\b[A-Z]{2,}\b/.test(after)) return true;
    return false;
  }

  // Track which text nodes we've already processed to avoid duplicate ranges
  let processedNodes = new WeakSet();

  function processTextNode(textNode) {
    if (shouldSkipNode(textNode)) return;
    if (processedNodes.has(textNode)) return;

    const text = textNode.textContent;
    if (!text || text.trim().length < 2) return;
    if (isAllCapsContext(text)) return;

    ACRONYM_REGEX.lastIndex = 0;
    let match;
    let found = false;
    while ((match = ACRONYM_REGEX.exec(text)) !== null) {
      if (
        isAcronym(match[0]) &&
        !window.__ACT.dismissedTerms.has(match[0]) &&
        !hasAdjacentCapsWord(text, match.index, match.index + match[0].length) &&
        !isPartOfTLDR(text, match.index, match.index + match[0].length) &&
        !isLikelyName(text, match.index, match.index + match[0].length)
      ) {
        // Create a Range covering this acronym in the text node
        try {
          const range = document.createRange();
          range.setStart(textNode, match.index);
          range.setEnd(textNode, match.index + match[0].length);
          acronymRanges.push({ range, term: match[0], textNode });
          found = true;
        } catch (e) {
          // Range creation can fail if offsets are invalid
        }
      }
    }

    if (found) {
      processedNodes.add(textNode);
    }
  }

  function scanSubtree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const tn of textNodes) {
      processTextNode(tn);
    }

    updateHighlight();
  }

  // ── CSS Custom Highlight API ────────────────────────────────────────────

  function updateHighlight() {
    if (!CSS.highlights) return;

    // Clean out stale ranges (detached nodes)
    for (let i = acronymRanges.length - 1; i >= 0; i--) {
      if (!document.contains(acronymRanges[i].textNode)) {
        processedNodes.delete(acronymRanges[i].textNode);
        acronymRanges.splice(i, 1);
      }
    }

    const ranges = acronymRanges.map(entry => entry.range);
    highlightObj = new Highlight(...ranges);
    CSS.highlights.set('act-acronym', highlightObj);
  }

  // ── Host page styles ──────────────────────────────────────────────────────

  /** Clear all state and rescan the page from scratch. */
  function rescanAll() {
    acronymRanges.length = 0;
    processedNodes = new WeakSet();
    scanSubtree(document.body);
  }

  function injectHostStyles() {
    if (document.getElementById('act-host-styles')) return;
    const style = document.createElement('style');
    style.id = 'act-host-styles';

    if (CSS.highlights) {
      // Use CSS Custom Highlight API — no DOM modifications needed
      style.textContent = `
        ::highlight(act-acronym) {
          text-decoration: underline dotted #a1a1aa;
          text-underline-offset: 3px;
          cursor: help;
        }
      `;
    }

    document.head.appendChild(style);
  }

  // ── Hover detection via mousemove + caretRangeFromPoint ─────────────────

  let lastHoverTerm = null;
  let lastHoverElement = null;

  /**
   * Given a mouse event, find if it's hovering over an acronym range.
   * Returns { term, range, textNode } or null.
   */
  function findAcronymAtPoint(x, y) {
    // Use caretRangeFromPoint (Chrome) or caretPositionFromPoint (Firefox)
    let caretRange;
    if (document.caretRangeFromPoint) {
      caretRange = document.caretRangeFromPoint(x, y);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos && pos.offsetNode) {
        caretRange = document.createRange();
        caretRange.setStart(pos.offsetNode, pos.offset);
        caretRange.setEnd(pos.offsetNode, pos.offset);
      }
    }

    if (!caretRange || caretRange.startContainer.nodeType !== Node.TEXT_NODE) {
      return null;
    }

    const textNode = caretRange.startContainer;
    const offset = caretRange.startOffset;

    // Find if this offset falls within any of our acronym ranges on this text node
    for (const entry of acronymRanges) {
      if (entry.textNode !== textNode) continue;
      try {
        if (offset >= entry.range.startOffset && offset <= entry.range.endOffset) {
          return entry;
        }
      } catch (e) {
        // Range may be invalid if DOM changed
      }
    }

    return null;
  }

  // ── MutationObserver ──────────────────────────────────────────────────────

  let debounceTimer = null;
  const pendingNodes = new Set();

  function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          pendingNodes.add(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          pendingNodes.add(node);
        }
      }
      // Clean up ranges for removed nodes
      for (const node of mutation.removedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          processedNodes.delete(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Removed elements may contain text nodes we tracked
          processedNodes.delete(node);
        }
      }
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(processPending, OBSERVER_DEBOUNCE_MS);
  }

  function processPending() {
    const nodes = Array.from(pendingNodes);
    pendingNodes.clear();

    for (const node of nodes) {
      if (!document.contains(node)) continue;
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        scanSubtree(node);
      }
    }

    updateHighlight();
  }

  // ── Initialization ────────────────────────────────────────────────────────

  async function init() {
    // Check for CSS Custom Highlight API support
    if (!CSS.highlights) {
      console.warn('[AcronymTooltip] CSS Custom Highlight API not supported. Acronym detection disabled.');
      return;
    }

    // Check if disabled for this site
    const hostname = window.location.hostname;
    try {
      const stored = await chrome.storage.sync.get(['disabledSites', 'dismissedTerms']);
      if (stored.disabledSites) {
        window.__ACT.disabledSites = new Set(stored.disabledSites);
      }
      if (stored.dismissedTerms) {
        window.__ACT.dismissedTerms = new Set(stored.dismissedTerms);
      }
    } catch (e) {
      // storage may fail in some contexts, continue anyway
    }

    if (window.__ACT.disabledSites.has(hostname)) return;

    injectHostStyles();

    // Initial scan of the full page
    scanSubtree(document.body);

    // Watch for dynamic content
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Expose for other content scripts
    window.__ACT.scanSubtree = scanSubtree;
    window.__ACT.updateHighlight = updateHighlight;
    window.__ACT.rescanAll = rescanAll;
    window.__ACT.observer = observer;
    window.__ACT.findAcronymAtPoint = findAcronymAtPoint;
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
