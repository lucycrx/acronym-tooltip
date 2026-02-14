// Acronym Tooltip — Service Worker (Background Script)
// Handles AI lookups, recent tracking, cache clearing, and manual popup lookups.
// WUT lookups are now done in the content script (which has internalfb cookies).

import { lookupAI } from './ai-api.js';
import { lookupWut as bgLookupWut } from './wut-api.js';
import { cacheClear } from './cache.js';

// ── Message handler ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // AI-only lookup (WUT already attempted in content script)
  if (message.type === 'aiLookup') {
    handleAILookup(message.term, message.context || {})
      .then(sendResponse)
      .catch((err) => {
        sendResponse({ term: message.term, error: err.message || 'AI lookup failed' });
      });
    return true;
  }

  // WUT lookup via service worker (for non-internalfb pages like workplace.com)
  if (message.type === 'bgWutLookup') {
    console.log('[AcronymTooltip][SW] bgWutLookup request for:', message.term);
    bgLookupWut(message.term)
      .then(sendResponse)
      .catch((err) => {
        console.warn('[AcronymTooltip][SW] bgWutLookup failed:', err);
        sendResponse([]);
      });
    return true;
  }

  // Track a recent lookup (fire-and-forget from content script)
  if (message.type === 'trackRecent') {
    addToRecent(message.term);
    return false;
  }

  if (message.type === 'clearCache') {
    cacheClear().then(() => sendResponse({ success: true }));
    return true;
  }

  // Manual lookup from popup — delegates WUT fetch to the active tab's
  // content script, then falls back to AI in the service worker.
  if (message.type === 'manualLookup') {
    handleManualLookup(message.term)
      .then(sendResponse)
      .catch((err) => {
        sendResponse({ term: message.term, error: err.message || 'Lookup failed' });
      });
    return true;
  }

  // Legacy: keep the old 'lookup' handler for backwards compat
  if (message.type === 'lookup') {
    handleAILookup(message.term, message.context || {})
      .then(sendResponse)
      .catch((err) => {
        sendResponse({ term: message.term, error: err.message || 'Lookup failed' });
      });
    return true;
  }
});

// ── AI-only lookup ──────────────────────────────────────────────────────────

async function handleAILookup(term, context) {
  const aiDef = await lookupAI(term, context);

  await addToRecent(term);

  return {
    term,
    source: aiDef ? 'ai' : 'none',
    definitions: [],
    aiDefinition: aiDef,
  };
}

// ── Manual lookup from popup ────────────────────────────────────────────────
// The popup doesn't have internalfb cookies, so we ask the active tab's
// content script to do the WUT lookup via message passing.

async function handleManualLookup(term) {
  // Try to delegate WUT lookup to the active tab's content script
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      const wutResult = await chrome.tabs.sendMessage(tab.id, {
        type: 'wutLookup',
        term,
      });
      if (wutResult && wutResult.length > 0) {
        await addToRecent(term);
        return {
          term,
          source: 'wut',
          definitions: wutResult,
          aiDefinition: null,
        };
      }
    }
  } catch (e) {
    // Content script may not be available — fall through to AI
  }

  // Fallback to AI
  return handleAILookup(term, {});
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
