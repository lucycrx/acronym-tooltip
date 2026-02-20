**Acronym Tooltip — a Chrome extension that defines Meta acronyms on hover**

Ever find yourself in a Workplace thread or wiki page full of acronyms you don't recognize? Acronym Tooltip automatically detects uppercase acronyms on internal Meta pages and shows their definitions in a tooltip when you hover over them.

**How it works:**
- Detects acronyms on Workplace, InternalFB, and Google Docs
- Looks up definitions from WUT first, with an AI fallback for terms WUT doesn't cover
- AI definitions use page context (surrounding text, group name, doc title) for accuracy
- Includes a direct "View on WUT" link in every tooltip

**Other features:**
- Search any acronym manually from the popup
- Disable per-site or dismiss individual terms you already know
- Configurable tooltip delay
- Definitions are cached so repeat lookups are instant

**Installation:**
1. Install from the Chrome Web Store (unlisted): [LINK]
2. WUT definitions work out of the box — no setup needed
3. To enable AI fallback definitions (for acronyms not in WUT):
   a. Get an API key from the Wearables APE portal
   b. Click the Acronym Tooltip icon in your Chrome toolbar
   c. Click **Settings** at the bottom of the popup
   d. Paste your API key into the **APE API Key** field and click **Save**

Without an API key, the extension still works — you'll just only see WUT-sourced definitions.

Feedback and feature requests welcome in the comments.

---

*Built with Claude Code and Remotion (React-based programmatic video) for the product demo. From idea to Chrome Web Store in a weekend.*
