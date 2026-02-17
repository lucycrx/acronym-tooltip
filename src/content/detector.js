// Acronym Tooltip — Acronym Detector (Content Script)
// Scans the DOM for acronyms, wraps them in spans, and watches for new content.

(function () {
  'use strict';

  // ── Constants (inlined to avoid module issues in content scripts) ──────────

  const ACRONYM_REGEX = /\b[A-Z]{2,8}\b/g;
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
  ]);

  // ── Shared state namespace ────────────────────────────────────────────────

  window.__ACT = window.__ACT || {};
  window.__ACT.dismissedTerms = new Set();
  window.__ACT.disabledSites = new Set();

  // ── Utility ───────────────────────────────────────────────────────────────

  function isAcronym(word) {
    return word.length >= 2 && word.length <= 8 && /^[A-Z]+$/.test(word) && !STOPWORDS.has(word);
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.classList && el.classList.contains('act-acronym')) return true;
      if (el.hasAttribute && el.hasAttribute('contenteditable')) return true;
      el = el.parentElement;
    }
    return false;
  }

  // ── DOM scanning ──────────────────────────────────────────────────────────

  function processTextNode(textNode) {
    if (shouldSkipNode(textNode)) return;

    const text = textNode.textContent;
    if (!text || text.trim().length < 2) return;

    ACRONYM_REGEX.lastIndex = 0;
    const matches = [];
    let match;
    while ((match = ACRONYM_REGEX.exec(text)) !== null) {
      if (isAcronym(match[0]) && !window.__ACT.dismissedTerms.has(match[0])) {
        matches.push({ word: match[0], index: match.index });
      }
    }

    if (matches.length === 0) return;

    // Build replacement fragment
    const frag = document.createDocumentFragment();
    let lastIndex = 0;

    for (const m of matches) {
      // Text before the match
      if (m.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
      }
      // Wrapped acronym span
      const span = document.createElement('span');
      span.className = 'act-acronym';
      span.dataset.term = m.word;
      span.textContent = m.word;
      frag.appendChild(span);
      lastIndex = m.index + m.word.length;
    }

    // Remaining text
    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
  }

  function scanSubtree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    // Collect text nodes first (modifying DOM during walk is unsafe)
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const tn of textNodes) {
      processTextNode(tn);
    }
  }

  // ── Host page styles ──────────────────────────────────────────────────────

  function injectHostStyles() {
    if (document.getElementById('act-host-styles')) return;
    const style = document.createElement('style');
    style.id = 'act-host-styles';
    style.textContent = `
      .act-acronym {
        color: inherit !important;
        border-bottom: 1px dotted #a1a1aa;
        cursor: help;
        transition: border-color 200ms ease-in-out;
      }
      .act-acronym:hover {
        border-bottom-color: #3f3f46;
      }
    `;
    document.head.appendChild(style);
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
  }

  // ── Initialization ────────────────────────────────────────────────────────

  async function init() {
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

    // Skip Google Slides — wrapping text in spans breaks Slides' CSS rendering,
    // causing acronyms to become invisible. Slide text is SVG (already skipped)
    // and notes are contenteditable (also skipped), so there's minimal value here.
    if (hostname === 'docs.google.com' && /^\/presentation\b/.test(window.location.pathname)) {
      return;
    }

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
    window.__ACT.observer = observer;
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
