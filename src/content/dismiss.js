// Acronym Tooltip — Dismiss Manager (Content Script)
// Manages the dismiss list: stores dismissed terms in chrome.storage.sync,
// removes acronym highlights for dismissed terms, and handles re-enabling.

(function () {
  'use strict';

  window.__ACT = window.__ACT || {};
  window.__ACT.dismissedTerms = window.__ACT.dismissedTerms || new Set();

  /**
   * Dismiss a term: add to storage and remove all highlights on the page.
   */
  async function dismissTerm(term) {
    window.__ACT.dismissedTerms.add(term);
    await saveDismissedTerms();
    removeHighlightsForTerm(term);
  }

  /**
   * Re-enable a previously dismissed term.
   */
  async function reEnableTerm(term) {
    window.__ACT.dismissedTerms.delete(term);
    await saveDismissedTerms();
    // Full rescan to pick up the term again (clears processedNodes)
    if (window.__ACT.rescanAll) {
      window.__ACT.rescanAll();
    }
  }

  /**
   * Remove all highlight ranges for a given term.
   */
  function removeHighlightsForTerm(term) {
    const ranges = window.__ACT.acronymRanges;
    if (!ranges) return;

    for (let i = ranges.length - 1; i >= 0; i--) {
      if (ranges[i].term === term) {
        ranges.splice(i, 1);
      }
    }

    if (window.__ACT.updateHighlight) {
      window.__ACT.updateHighlight();
    }
  }

  /**
   * Persist the dismissed terms set to chrome.storage.sync.
   */
  async function saveDismissedTerms() {
    try {
      await chrome.storage.sync.set({
        dismissedTerms: Array.from(window.__ACT.dismissedTerms),
      });
    } catch (e) {
      console.warn('[AcronymTooltip] Failed to save dismissed terms:', e);
    }
  }

  /**
   * Load dismissed terms from storage (called during init in detector.js).
   */
  async function loadDismissedTerms() {
    try {
      const result = await chrome.storage.sync.get('dismissedTerms');
      if (result.dismissedTerms && Array.isArray(result.dismissedTerms)) {
        window.__ACT.dismissedTerms = new Set(result.dismissedTerms);
      }
    } catch (e) {
      // Continue with empty set
    }
  }

  // Expose
  window.__ACT.dismissTerm = dismissTerm;
  window.__ACT.reEnableTerm = reEnableTerm;
  window.__ACT.loadDismissedTerms = loadDismissedTerms;
})();
