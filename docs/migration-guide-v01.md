# Migration Guide v0.1

## Goal

Create a practical path from legacy UI to Fr8Labs Design System (FDS) UI without a full frontend refactor.

## Import Rule

Testing surfaces import Fr8Labs-owned components from `sandbox-fds-components`. Do not add another UI runtime behind product-facing FDS APIs.

## Setup Rule

Install `sandbox-fds-components`, `sandbox-fds-icons`, and `sandbox-fds-tokens`.
Import `sandbox-fds-components/styles.css` once at the application entry point
and wrap the migrated surface in `FdsProvider`.

## Figma Rule

If Figma links/files are provided later, treat them as legacy product references only. Use them to understand workflows, screen density, repeated patterns, component gaps, migration risks, and business behavior.

Do not copy the old visual design, colors, spacing, or component decisions as the new design foundation.

## Migration Strategy

1. Identify repeated legacy patterns.
2. Map each pattern to a FDS UI component or composition.
3. Replace one workflow surface at a time.
4. Keep behavior stable unless the story explicitly includes behavior changes.
5. Review in Storybook or a sandbox before production rollout.

## Legacy-To-Fr8 Mapping

- Legacy button variants -> FDS `Button` and `IconButton`.
- Legacy status labels -> FDS `StatusBadge`.
- Legacy filters -> FDS `FilterBar` composition.
- Legacy simple, read-only tables -> FDS `DataTable`.
- Legacy complex operational tables -> FDS `FDSDataGrid`.
- Legacy invoice lines -> FDS `DataTable` composition, or `FDSDataGrid` when operational grid features are required.
- Legacy side forms -> FDS `Drawer` and `Panel` composition.
- Legacy alerts -> FDS `InlineAlert` or `Notification`.

## Refactor Checklist

- Does the screen import only from `sandbox-fds-components` for design-system components?
- Is `sandbox-fds-components/styles.css` imported once and the surface wrapped in `FdsProvider`?
- Are copied raw colors removed in favour of published semantic or component tokens?
- Are statuses semantic, not visual-only?
- Are labels visible for form controls?
- Are disabled/loading/error states covered?
- Do existing alerts that must remain visible use `InlineAlert persistent`?
- Are fake stories or examples available for review?
- Does the change avoid unrelated cleanup?

## v0.1 Migration Limit

Migrate only pilot surfaces or examples. Do not attempt a broad app refactor in v0.1.

## When To Add More

Add new FDS UI wrappers only when a repeated production pattern or pilot prototype needs them.
