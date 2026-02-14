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
    // Re-scan the page to pick up the term again
    if (window.__ACT.scanSubtree) {
      window.__ACT.scanSubtree(document.body);
    }
  }

  /**
   * Remove all .act-acronym spans for a given term, replacing with plain text.
   */
  function removeHighlightsForTerm(term) {
    const spans = document.querySelectorAll(`.act-acronym[data-term="${term}"]`);
    for (const span of spans) {
      const textNode = document.createTextNode(span.textContent);
      span.parentNode.replaceChild(textNode, span);
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
