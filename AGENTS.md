<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ESG Portal UI Architecture Manifesto

Every AI agent working on this repository MUST follow these rules to maintain design integrity (Google Stitch style) and architectural scalability.

## 1. Hybrid Modular Strategy (Hybrid Architecture)
- **Standardized Core**: Hero sections, CTAs, and Navigation must use universal components.
- **Selective Specialized Modules**: Domain-specific features (e.g., Heatmaps, LCA Tables, Roadmaps) should be extracted into small, reusable components in `@/components/solutions/`.
- **Minimalist Dispatcher**: The main layout dispatcher in `src/app/solutions/[slug]/page.js` should remain clean, only orchestrating the order of high-level blocks.

## 2. Component Design Principles
- **Single Responsibility (SRP)**: Each component should do ONE thing well. Avoid "God Components" with too many conditional flags.
- **Composition over Configuration**: Prefer passing child components or slots rather than using 20+ props to toggle styles.
- **Design Token Discipline**: NEVER hardcode hex colors or pixel spacings. Use the theme tokens defined in `globals.css` (e.g., `text-display-lg`, `bg-surface-container`).

## 3. Maintenance Protocols
- **No Fragmentation**: Do not create one-off custom code snippets inside page files. If a design pattern appears twice, it MUST be componentized.
- **AI Sovereignty**: If you are a new AI taking over, read the existing `src/components/solutions/` library before creating new UI code.

## 4. CRITICAL SAFETY & STABILITY (Red Lines)
- **Fallback Content Sovereignty**: NEVER remove the hardcoded fallback data arrays (e.g., `defaultSolutions`) from the dynamic fetching logic. These are the ONLY reason the site doesn't go blank when Sanity APIs fail or are empty.
- **Legacy Route Protection**: DO NOT delete or refactor the directory `src/app/solutions/ [slug]` (the one with the SPACE). It is a legacy experiment path that MUST remain active to prevent 404s for historical links.
- **Data Integrity (UTF-8)**: When creating ingestion scripts or patching Sanity, ALWAYS enforce UTF-8 encoding. Garbled text (Big5 mismatch) is considered a CRITICAL FAILURE.
- **Environment Context**: Always check for the existence of `production` data in Sanity before assuming dynamic rendering will work. If the dataset is empty, prioritize enhancing the Fallback UI.
