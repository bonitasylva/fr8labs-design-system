---
target: "http://127.0.0.1:6006/?path=/docs/foundations-tokens--docs"
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-21T06-49-34Z
slug: ackages-components-src-stories-tokenfoundation-mdx
---
## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | No in-page progress or section wayfinding. |
| 2 | Match between system and real world | 3 | Technical vocabulary assumes engineering fluency. |
| 3 | User control and freedom | 2 | Detailed destinations only appear as footer links. |
| 4 | Consistency and standards | 3 | Minor split between "Do not use" and "Avoid". |
| 5 | Error prevention | 3 | Use/avoid comparison prevents common token misuse. |
| 6 | Recognition rather than recall | 2 | Readers must retain the semantic rule while scanning code. |
| 7 | Flexibility and efficiency | 2 | No direct route from a task to the semantic catalog. |
| 8 | Aesthetic and minimalist design | 3 | Clean but some rules and whitespace feel procedural. |
| 9 | Error recovery | 2 | Existing primitive misuse has no recovery path. |
| 10 | Help and documentation | 3 | Clear core guidance, weak task-to-reference handoff. |
| **Total** | | **26/40** | **Sound foundation; targeted structural work needed** |

## Design Specificity Verdict

The page is recognizably FDS: compact navy/mist/border-led documentation with Route Blue reserved for the semantic layer. It does not feel like generic marketing. The central "one direction" claim is under-realised because the three planes still read like a compact reference table rather than a perceivable source-to-consumer flow.

The deterministic scan returned no findings for `packages/components/src/stories/TokenFoundation.mdx`. Fresh desktop and mobile browser evidence found no horizontal overflow or runtime errors. No overlay was injected because the available browser mutation surface is read-only.

## Overall Impression

Calm, precise, and credible, but it makes readers work too hard to turn the token model into their next action. The biggest opportunity is to make the semantic catalog the immediate practical route instead of a footer destination.

## What's Working

- Route Blue is isolated to the semantic plane, making the consumer-facing layer unmistakable.
- The flat border-and-mist composition fits FDS and keeps the reference content legible.
- The Use / Do not use table turns policy into concrete examples.

## Priority Issues

### P1 — Directional claim and visual form conflict

The page says values move upward, but the three planes read as a stacked taxonomy. Add a restrained, explicit source → semantic → component progression without turning it into a decorative flowchart. Suggested command: `$impeccable layout`.

### P1 — The first practical action is buried

The semantic catalog is only a footer link. Give the Semantic plane and the opening task guidance a direct, visible route to the semantic reference. Suggested command: `$impeccable layout`.

### P2 — Approved choices are not visually dominant enough

Use and Do not use are equally dense code columns. Make the approved choice the primary scan target and let the avoidance rationale recede. Suggested command: `$impeccable polish`.

### P2 — Designers receive only implementation evidence

Every proof point is a CSS identifier. Add one compact rendered semantic-role example to connect visual intent to the token policy. Suggested command: `$impeccable clarify`.

### P2 — Governance ends in a rule, not an assisted decision

The FDS review threshold and destination are implied rather than explicit. Add a short reusable-decision test and visible review route. Suggested command: `$impeccable clarify`.

## Persona Red Flags

- **New frontend engineer:** can understand the rule but has no fastest next click or primitive-migration path.
- **Product designer:** sees CSS names instead of a visible semantic-role outcome.
- **FDS maintainer:** receives governance wording without a reusable-decision test or request route.

## Minor Observations

- The upper cross-section has less visual weight than its conceptual role warrants.
- The footer links are easy to miss as the real handoff.
- “Do not use” is more prohibitive than the page’s otherwise measured voice.

## Questions to Consider

- If an engineer needs one primary next step, why is the semantic catalog a footer destination?
- Does “one direction” need to be seen as a flow before it is read as a rule?
- Can a designer identify the intended role without already knowing CSS token names?
