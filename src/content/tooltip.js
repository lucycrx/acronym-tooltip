// Acronym Tooltip — Tooltip Renderer (Content Script)
// Renders a Shadow DOM tooltip on hover over .act-acronym spans.

(function () {
  'use strict';

  window.__ACT = window.__ACT || {};

  const SHOW_DELAY = 200;
  const HIDE_DELAY = 300;

  let tooltipHost = null;   // The DOM element that hosts the Shadow DOM
  let shadowRoot = null;     // The Shadow DOM root
  let tooltipEl = null;      // The .act-tooltip div inside shadow
  let showTimer = null;
  let hideTimer = null;
  let currentTerm = null;

  // ── Tooltip CSS (inlined to avoid module deps) ────────────────────────────

  const TOOLTIP_CSS = `
    :host {
      all: initial;
      position: absolute;
      z-index: 2147483647;
      pointer-events: none;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .act-tooltip {
      pointer-events: auto;
      background: #fafafa;
      border: 1px solid #e4e4e7;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
      color: #09090b;
      max-width: 380px;
      min-width: 240px;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
      overflow: hidden;
    }
    .act-tooltip.act-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .act-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px 0 16px;
    }
    .act-term {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: #09090b;
    }
    .act-badge {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #a1a1aa;
      background: none;
      padding: 0;
      border-radius: 0;
    }
    .act-badge--ai {
      color: #8b5cf6;
      background: none;
    }
    .act-dismiss {
      border-radius: 9999px;
      border: 1px solid #d4d4d8;
      background: transparent;
      color: #71717a;
      font-family: inherit;
      font-size: 10px;
      font-weight: 500;
      padding: 3px 7px;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .act-dismiss:hover {
      color: #3f3f46;
      border-color: #a1a1aa;
      background: transparent;
    }

    .act-primary-def { padding: 12px 16px 0 16px; }
    .act-def-text { color: #09090b; line-height: 1.5; font-size: 13px; }
    .act-divider {
      border: none;
      border-top: 1px solid #e4e4e7;
      margin: 12px 16px 0 16px;
    }

    .act-other-defs { padding: 0 16px; margin-top: 10px; }
    .act-other-defs summary {
      font-size: 12px;
      color: #71717a;
      cursor: pointer;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 4px;
      user-select: none;
    }
    .act-other-defs summary::-webkit-details-marker { display: none; }
    .act-other-defs summary::after {
      content: '\\25BE';
      font-size: 14px;
      transition: transform 300ms ease-in-out;
    }
    .act-other-defs[open] summary::after { transform: rotate(180deg); }

    .act-def-row {
      padding: 8px 10px;
      margin-top: 4px;
      border-radius: 8px;
      border-bottom: 1px solid #e4e4e7;
      transition: background-color 300ms ease-in-out;
    }
    .act-def-row:last-child { border-bottom: none; }
    .act-def-row:hover { background: #eeeff3; }
    .act-def-row p { font-size: 13px; color: #71717a; line-height: 1.4; }


    .act-footer {
      border-top: 1px solid #e4e4e7;
      margin-top: 12px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    .act-wut-link {
      border-radius: 9999px;
      border: none;
      background: #0082FB;
      color: #ffffff;
      font-size: 10px;
      font-weight: 500;
      padding: 4px 8px;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      flex-shrink: 0;
      white-space: nowrap;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .act-wut-link:hover { color: #ffffff; background: #006ad4; }
    .act-wut-link svg { flex-shrink: 0; }

    .act-loading {
      padding: 20px 16px;
      text-align: center;
      color: #a1a1aa;
      font-size: 12px;
    }
    .act-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #e4e4e7;
      border-top-color: #71717a;
      border-radius: 50%;
      animation: act-spin 0.6s linear infinite;
      margin-bottom: 6px;
    }
    @keyframes act-spin { to { transform: rotate(360deg); } }

    .act-error {
      padding: 16px;
      color: #71717a;
      font-size: 12px;
      text-align: center;
    }
  `;

  // ── Shadow DOM setup ──────────────────────────────────────────────────────

  function ensureTooltipHost() {
    if (tooltipHost && document.contains(tooltipHost)) return;

    tooltipHost = document.createElement('div');
    tooltipHost.id = 'act-tooltip-host';
    tooltipHost.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;overflow:visible;z-index:2147483647;pointer-events:none;';
    document.body.appendChild(tooltipHost);

    shadowRoot = tooltipHost.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = TOOLTIP_CSS;
    shadowRoot.appendChild(style);

    tooltipEl = document.createElement('div');
    tooltipEl.className = 'act-tooltip';
    shadowRoot.appendChild(tooltipEl);

    // Keep tooltip open when mouse enters it
    tooltipEl.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
    });
    tooltipEl.addEventListener('mouseleave', () => {
      scheduleHide();
    });
  }

  // ── Positioning ───────────────────────────────────────────────────────────

  function positionTooltip(anchorSpan) {
    const rect = anchorSpan.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Position above the term by default
    tooltipHost.style.position = 'absolute';

    // Temporarily make visible to measure
    tooltipEl.style.visibility = 'hidden';
    tooltipEl.style.display = 'block';
    const tooltipRect = tooltipEl.getBoundingClientRect();

    let top = rect.top + scrollY - tooltipRect.height - 8;
    let left = rect.left + scrollX;

    // Flip below if not enough space above
    if (top < scrollY) {
      top = rect.bottom + scrollY + 8;
    }

    // Clamp horizontally
    const maxLeft = document.documentElement.clientWidth + scrollX - tooltipRect.width - 16;
    if (left > maxLeft) left = maxLeft;
    if (left < scrollX + 8) left = scrollX + 8;

    tooltipHost.style.left = `${left}px`;
    tooltipHost.style.top = `${top}px`;
    tooltipEl.style.visibility = '';
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  function renderLoading(term) {
    tooltipEl.innerHTML = `
      <div class="act-header">
        <span class="act-term">${escapeHtml(term)}</span>
      </div>
      <div class="act-loading">
        <div class="act-spinner"></div>
        <div>Looking up...</div>
      </div>
    `;
  }

  function renderDefinition(data) {
    const { term, definitions, source, aiDefinition } = data;
    const isAI = source === 'ai';
    const hasDefs = definitions && definitions.length > 0;

    let html = `
      <div class="act-header">
        <span class="act-term">${escapeHtml(term)}</span>
        <span class="act-badge ${isAI ? 'act-badge--ai' : ''}">${isAI ? 'AI-generated' : 'WUT'}</span>
      </div>
    `;

    if (isAI && aiDefinition) {
      html += `
        <div class="act-primary-def">
          <p class="act-def-text">${escapeHtml(aiDefinition)}</p>
        </div>
      `;
    } else if (hasDefs) {
      const primary = definitions[0];
      html += `
        <div class="act-primary-def">
          <p class="act-def-text">${escapeHtml(primary.definition)}</p>
        </div>
      `;

      // Other definitions
      const others = definitions.slice(1, 4); // max 3 more
      if (others.length > 0) {
        html += `<hr class="act-divider">`;
        html += `<details class="act-other-defs">`;
        html += `<summary>Not right? See other definitions</summary>`;
        for (const def of others) {
          html += `
            <div class="act-def-row">
              <p>${escapeHtml(def.definition)}</p>
            </div>
          `;
        }
        html += `</details>`;
      }
    } else {
      html += `
        <div class="act-error">No definitions found.</div>
      `;
    }

    // Footer with WUT link
    html += `
      <div class="act-footer">
        <a class="act-wut-link" href="https://www.internalfb.com/intern/wut/word/?word=${encodeURIComponent(term)}" target="_blank" rel="noopener">${isAI ? 'Define on WUT' : 'View on WUT'} ${externalLinkIcon()}</a>
        <button class="act-dismiss" data-term="${escapeHtml(term)}">Don&#39;t show again</button>
      </div>
    `;

    tooltipEl.innerHTML = html;

    // Attach dismiss handler
    const dismissBtn = tooltipEl.querySelector('.act-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const t = dismissBtn.dataset.term;
        if (window.__ACT.dismissTerm) {
          window.__ACT.dismissTerm(t);
        }
        hideTooltip();
      });
    }
  }

  function renderError(term, message) {
    tooltipEl.innerHTML = `
      <div class="act-header">
        <span class="act-term">${escapeHtml(term)}</span>
      </div>
      <div class="act-error">${escapeHtml(message || 'Failed to load definition.')}</div>
      <div class="act-footer">
        <a class="act-wut-link" href="https://www.internalfb.com/intern/wut/word/?word=${encodeURIComponent(term)}" target="_blank" rel="noopener">Try on WUT ${externalLinkIcon()}</a>
      </div>
    `;
  }

  // ── Two-tier lookup: WUT (content script) then AI (service worker) ──────

  async function lookupTerm(term, context) {
    // Tier 1: WUT lookup from content script (has internalfb cookies)
    if (window.__ACT.lookupWut) {
      try {
        const wutDefs = await window.__ACT.lookupWut(term);
        if (wutDefs && wutDefs.length > 0) {
          // Track the lookup in the service worker
          chrome.runtime.sendMessage({ type: 'trackRecent', term });
          return {
            term,
            source: 'wut',
            definitions: wutDefs,
            aiDefinition: null,
          };
        }
      } catch (e) {
        console.warn('[AcronymTooltip] Content-script WUT lookup failed:', e);
      }
    }

    // Tier 2: AI fallback via service worker (needs APE API key from storage)
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: 'aiLookup', term, context },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error('Extension error'));
            return;
          }
          resolve(response);
        }
      );
    });
  }

  // ── Show / Hide ───────────────────────────────────────────────────────────

  function showTooltip(anchorSpan) {
    const term = anchorSpan.dataset.term;
    if (!term) return;

    clearTimeout(hideTimer);
    ensureTooltipHost();

    currentTerm = term;
    renderLoading(term);
    positionTooltip(anchorSpan);

    // Fade in
    requestAnimationFrame(() => {
      tooltipEl.classList.add('act-visible');
    });

    // Try WUT lookup directly from content script (has cookies),
    // then fall back to service worker for AI if no WUT result.
    const context = window.__ACT.extractContext
      ? window.__ACT.extractContext(anchorSpan)
      : { surroundingText: '', pageSource: '' };

    lookupTerm(term, context).then((response) => {
      if (currentTerm !== term) return; // stale response
      if (response && response.error) {
        renderError(term, response.error);
      } else if (response) {
        renderDefinition(response);
      } else {
        renderError(term, 'No response from extension.');
      }
      // Re-position after content changes
      positionTooltip(anchorSpan);
    }).catch(() => {
      if (currentTerm !== term) return;
      renderError(term, 'Lookup failed.');
      positionTooltip(anchorSpan);
    });
  }

  function hideTooltip() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (tooltipEl) {
      tooltipEl.classList.remove('act-visible');
    }
    currentTerm = null;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideTooltip, HIDE_DELAY);
  }

  // ── Event delegation ──────────────────────────────────────────────────────

  document.body.addEventListener('mouseenter', (e) => {
    const span = e.target.closest ? e.target.closest('.act-acronym') : null;
    if (!span) return;

    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    showTimer = setTimeout(() => showTooltip(span), SHOW_DELAY);
  }, true);

  document.body.addEventListener('mouseleave', (e) => {
    const span = e.target.closest ? e.target.closest('.act-acronym') : null;
    if (!span) return;

    clearTimeout(showTimer);
    scheduleHide();
  }, true);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function externalLinkIcon() {
    return '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 1.5L5.5 6.5"/><path d="M7 1.5H10.5V5"/><path d="M10.5 7.5V10A1 1 0 0 1 9.5 11H2A1 1 0 0 1 1 10V2.5A1 1 0 0 1 2 1.5H4.5"/></svg>';
  }
})();
