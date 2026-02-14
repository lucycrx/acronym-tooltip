// Acronym Tooltip — Service Worker (Background Script)
// Routes messages from content scripts, orchestrates WUT + AI lookups.

import { lookupWut } from './wut-api.js';
import { lookupAI } from './ai-api.js';
import { cacheClear } from './cache.js';

// ── Message handler ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'lookup') {
    handleLookup(message.term, message.context || {})
      .then(sendResponse)
      .catch((err) => {
        sendResponse({ term: message.term, error: err.message || 'Lookup failed' });
      });
    return true; // async response
  }

  if (message.type === 'clearCache') {
    cacheClear().then(() => sendResponse({ success: true }));
    return true;
  }

  if (message.type === 'manualLookup') {
    handleLookup(message.term, {})
      .then(sendResponse)
      .catch((err) => {
        sendResponse({ term: message.term, error: err.message || 'Lookup failed' });
      });
    return true;
  }
});

// ── Lookup orchestration ────────────────────────────────────────────────────

/**
 * Two-tier lookup: WUT first, then AI fallback.
 * @param {string} term
 * @param {{ surroundingText: string, pageSource: string }} context
 * @returns {Promise<object>} Result object for the tooltip
 */
async function handleLookup(term, context) {
  // Tier 1: WUT
  const wutDefs = await lookupWut(term);

  if (wutDefs && wutDefs.length > 0) {
    // Track recent lookups
    await addToRecent(term);

    return {
      term,
      source: 'wut',
      definitions: wutDefs,
      aiDefinition: null,
    };
  }

  // Tier 2: AI fallback
  const aiDef = await lookupAI(term, context);

  await addToRecent(term);

  return {
    term,
    source: aiDef ? 'ai' : 'none',
    definitions: [],
    aiDefinition: aiDef,
  };
}

// ── Recent lookups tracking ─────────────────────────────────────────────────

const MAX_RECENT = 20;

async function addToRecent(term) {
  try {
    const result = await chrome.storage.local.get('recentLookups');
    let recent = result.recentLookups || [];

    // Remove if already present (to move to front)
    recent = recent.filter(t => t !== term);
    recent.unshift(term);

    // Trim to max
    if (recent.length > MAX_RECENT) {
      recent = recent.slice(0, MAX_RECENT);
    }

    await chrome.storage.local.set({ recentLookups: recent });
  } catch (e) {
    // ignore
  }
}
