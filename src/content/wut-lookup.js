// Acronym Tooltip — WUT Lookup (Content Script)
// Delegates all WUT lookups to the service worker, which fetches and parses
// the WUT word page HTML.

(function () {
  'use strict';

  window.__ACT = window.__ACT || {};

  console.log('[AcronymTooltip][WUT] wut-lookup.js loaded on', window.location.hostname);

  async function lookupWut(term) {
    console.log('[AcronymTooltip][WUT] Looking up term via service worker:', term);
    try {
      const result = await chrome.runtime.sendMessage({ type: 'bgWutLookup', term });
      console.log('[AcronymTooltip][WUT] Service worker returned:', result);
      return result || [];
    } catch (e) {
      console.warn('[AcronymTooltip][WUT] WUT lookup failed:', e);
      return [];
    }
  }

  window.__ACT.lookupWut = lookupWut;

  // Listen for messages from the service worker (e.g., popup manual lookups)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'wutLookup' && message.term) {
      lookupWut(message.term)
        .then(sendResponse)
        .catch(() => sendResponse([]));
      return true; // async response
    }
  });
})();
