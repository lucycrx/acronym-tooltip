// Acronym Tooltip — Page Context Extraction (Content Script)
// Extracts surrounding text and page metadata for AI fallback context.

(function () {
  'use strict';

  const MAX_CONTEXT_LENGTH = 500;

  /**
   * Extract context around a given element (e.g. the parent of an acronym text node).
   * Returns { surroundingText: string, pageSource: string }
   */
  function extractContext(element) {
    const pageSource = getPageSource();
    const surroundingText = getSurroundingText(element);
    return { surroundingText, pageSource };
  }

  /**
   * Identify the page source (Workplace group, Google Doc title, wiki page, etc.)
   */
  function getPageSource() {
    const hostname = window.location.hostname;

    // Workplace
    if (hostname.includes('workplace.com')) {
      return getWorkplaceSource();
    }

    // Google Docs
    if (hostname === 'docs.google.com') {
      return getGDocsSource();
    }

    // Wiki / internalfb
    if (hostname.includes('internalfb.com')) {
      return getInternalFBSource();
    }

    return `Page: ${document.title || hostname}`;
  }

  function getWorkplaceSource() {
    // Try to get the Workplace group name from breadcrumb or header
    const groupLink = document.querySelector(
      '[role="banner"] a[href*="/groups/"], ' +
      'a[data-testid="group-name"], ' +
      'h1 a[href*="/groups/"]'
    );
    if (groupLink) {
      return `Workplace group: ${groupLink.textContent.trim()}`;
    }

    // Fallback to page title
    const title = document.title || '';
    return `Workplace: ${title.replace(/ \| Workplace.*$/, '').trim()}`;
  }

  function getGDocsSource() {
    // Google Docs title is in an input with class 'docs-title-input'
    const titleInput = document.querySelector('.docs-title-input, [data-testid="doc-title"]');
    if (titleInput) {
      return `Google Doc: ${titleInput.value || titleInput.textContent || ''}`.trim();
    }
    // Fallback to document title
    const title = document.title || '';
    return `Google Doc: ${title.replace(/ - Google Docs$/, '').trim()}`;
  }

  function getInternalFBSource() {
    const path = window.location.pathname;

    // Wiki pages
    if (path.includes('/wiki/')) {
      const breadcrumb = document.querySelector('[data-testid="wiki-breadcrumb"], .wiki-breadcrumb');
      if (breadcrumb) {
        return `Wiki: ${breadcrumb.textContent.trim()}`;
      }
    }

    // WUT pages
    if (path.includes('/wut/')) {
      return `WUT page`;
    }

    return `InternalFB: ${document.title || path}`;
  }

  /**
   * Get the text surrounding the element for context.
   * Walks up to the nearest block-level container and extracts its text.
   */
  function getSurroundingText(element) {
    if (!element) return '';

    // Walk up to find the nearest meaningful container
    const blockTags = new Set(['P', 'DIV', 'ARTICLE', 'SECTION', 'LI', 'TD', 'BLOCKQUOTE', 'SPAN']);
    let container = element.parentElement;
    let depth = 0;

    while (container && depth < 5) {
      if (blockTags.has(container.tagName)) {
        const text = container.innerText || container.textContent || '';
        if (text.length > 30) {
          return truncate(text, MAX_CONTEXT_LENGTH);
        }
      }
      container = container.parentElement;
      depth++;
    }

    // Fallback: try Workplace post body
    const postBody = element.closest(
      '[data-ad-preview="message"], ' +
      '[data-testid="post-message"], ' +
      '.userContent, ' +
      '[dir="auto"]'
    );
    if (postBody) {
      return truncate(postBody.innerText || postBody.textContent || '', MAX_CONTEXT_LENGTH);
    }

    // Last resort: grab some text around the element from the parent
    const parent = element.parentElement;
    if (parent) {
      return truncate(parent.innerText || parent.textContent || '', MAX_CONTEXT_LENGTH);
    }

    return '';
  }

  function truncate(text, maxLength) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.slice(0, maxLength) + '...';
  }

  // Expose to shared namespace
  window.__ACT = window.__ACT || {};
  window.__ACT.extractContext = extractContext;
})();
