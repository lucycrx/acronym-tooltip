// Tooltip CSS injected into Shadow DOM — fully self-contained, no leakage
// Uses Zinc design system tokens

const ACT_TOOLTIP_STYLES = `
  :host {
    all: initial;
    position: absolute;
    z-index: 2147483647;
    pointer-events: none;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .act-tooltip {
    pointer-events: auto;
    position: relative;
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
    overflow: visible;
  }

  .act-tooltip::before {
    content: '';
    position: absolute;
    inset: -20px;
    z-index: -1;
  }

  .act-tooltip.act-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Header */
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
    margin-left: auto;
    border-radius: 9999px;
    border: 1px solid #d4d4d8;
    background: transparent;
    color: #71717a;
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 9px;
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

  /* Primary definition */
  .act-primary-def {
    padding: 12px 16px 0 16px;
  }

  .act-def-text {
    color: #09090b;
    line-height: 1.5;
    font-size: 13px;
  }

  .act-votes {
    display: inline-block;
    font-size: 11px;
    color: #a1a1aa;
    margin-top: 4px;
  }

  /* Divider */
  .act-divider {
    border: none;
    border-top: 1px solid #e4e4e7;
    margin: 12px 16px 0 16px;
  }

  /* Other definitions — collapsible */
  .act-other-defs {
    padding: 0 16px;
    margin-top: 10px;
  }

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

  .act-other-defs summary::-webkit-details-marker {
    display: none;
  }

  .act-other-defs summary::after {
    content: '\\25BE';
    font-size: 10px;
    transition: transform 300ms ease-in-out;
  }

  .act-other-defs[open] summary::after {
    transform: rotate(180deg);
  }

  .act-def-row {
    padding: 8px 10px;
    margin-top: 4px;
    border-radius: 8px;
    transition: background-color 300ms ease-in-out;
  }

  .act-def-row:hover {
    background: #f4f4f5;
  }

  .act-def-row p {
    font-size: 13px;
    color: #71717a;
    line-height: 1.4;
  }

  .act-def-row .act-votes {
    font-size: 11px;
    color: #a1a1aa;
  }

  /* Footer */
  .act-footer {
    border-top: 1px solid #e4e4e7;
    margin-top: 12px;
    padding: 10px 16px;
  }

  .act-wut-link {
    border-radius: 9999px;
    border: none;
    background: #0082FB;
    color: #ffffff;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    cursor: pointer;
    transition: all 150ms ease-in-out;
    flex-shrink: 0;
    white-space: nowrap;
    text-decoration: none;
  }

  .act-wut-link:hover {
    color: #ffffff;
    background: #006ad4;
  }

  /* Loading state */
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

  @keyframes act-spin {
    to { transform: rotate(360deg); }
  }

  /* Error state */
  .act-error {
    padding: 16px;
    color: #71717a;
    font-size: 12px;
    text-align: center;
  }

  /* Acronym highlight on the page (injected outside Shadow DOM) */
`;

// CSS for the acronym spans injected into the host page
const ACT_HOST_STYLES = `
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
