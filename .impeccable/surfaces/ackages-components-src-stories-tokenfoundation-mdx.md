---
version: 1
slug: "ackages-components-src-stories-tokenfoundation-mdx"
primary_target: "packages/components/src/stories/TokenFoundation.mdx"
related_targets: ["packages/components/src/stories/TokenFoundation.stories.css"]
---

# Tokens overview

- Mode: Read.
- Audience: product designers and frontend engineers using FDS in freight workflows.
- Job: choose the correct token layer and consumer-facing role before opening detailed references.
- Content: the approved FDS token model, quick-reference examples, governance rule, and links to detailed token stories.
- Constraints: preserve semantic-token architecture, compact flat FDS visual language, visible code examples, and narrow-screen readability.
- Chosen direction: Layer cross-section. Three connected source-to-consumer planes lead the page; the semantic plane is the sole Route Blue signal, and the quick-reference table follows as proof.
- Memorable moment: the reader can see, in one pass, where values start, where product code enters, and where component mappings end.

## Route ground truth

- The route opens with an inline scope boundary, then a full-width three-plane cross-section: Primitive is maintainer-owned source scale, Semantic is the consumer entry point, and Component is the internal FDS implementation rule. Each plane pairs its role with a representative CSS custom property and ownership guidance.
- The semantic plane alone receives the active treatment within the cross-section: a Mist Surface band with Active Route Blue heading and code. The rest of the route stays flat, bordered, and typography-led.
- “Choose by meaning” is a five-row semantic-token table that pairs a real need with the approved consumer-facing role and its prohibited primitive or internal alternative. It becomes labeled stacked rows at the narrow layout.
- Governance follows the reference table: new tokens require a confirmed reusable decision, documented role/source mapping/affected components, `npm run check:tokens`, and FDS review. The route ends with links to primitive, semantic, breakpoint, and naming references.
- At 60rem and below, the cross-section stacks each plane without changing reading order; at 52rem and below, the reference table exposes its Use and Avoid labels per row rather than requiring horizontal scrolling.
