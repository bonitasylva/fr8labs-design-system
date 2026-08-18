# FDSDataGrid Contract v0.1

Date: 2026-07-13

## Purpose

`FDSDataGrid` is the FDS-owned integration layer for AG Grid in complex, high-density operational and accounting workflows. It provides a consistent Fr8Labs visual language, accessibility defaults, and product-safe configuration through the current `sandbox-fds-components` public export.

It does not replace AG Grid or recreate its data-grid capabilities.

The approved v0.1 implementation is deliberately bounded. Editing, specialised cell contracts, pagination, saved views, and other capability described below remain target requirements until a pilot explicitly approves them.

## Engine Boundary

- AG Grid is the underlying engine for `FDSDataGrid`.
- `sandbox-fds-components` provides the surrounding FDS foundation: tokens, forms, buttons, dialogs, statuses, layout, and feedback surfaces.
- FDS owns the AG Grid theme/defaults, supported column types, renderers/editors, state treatment, and interaction policy.
- Product screens consume `FDSDataGrid`; they must not set independent AG Grid themes, CSS overrides, or duplicate standard renderers/editors.
- Use native FDS composition for simple, non-interactive tables, summaries, and short read-only lists. Use `FDSDataGrid` when comparison, filtering, selection, inline editing, saved views, large datasets, or column management are required.

## Density and Sizing

`density` has two supported modes. Exact values are FDS defaults, not per-screen styling knobs.

| Token intent | Compact | Comfortable |
| --- | ---: | ---: |
| Body row height | 32 px | 40 px |
| Header height | 36 px | 44 px |
| Filter/list-item height | 32 px | 40 px |
| Cell horizontal padding | 8 px | 12 px |
| Default use | Repeated freight and accounting work | Review, setup, and lower-density screens |

Density must map through FDS spacing and typography tokens to AG Grid theme parameters/CSS properties. Row, header, and list-item height must be configured through AG Grid-supported parameters, never by styling row DOM elements directly. Fixed-height rows are the default for predictable virtualized performance.

## FDS-Owned Visual and Interaction Defaults

- Typography: FDS data/label typography; tabular figures for finance, quantities, weights, and volumes; right-align numeric values.
- Spacing: FDS spacing tokens control cell padding, header spacing, menus, filters, and tool panels.
- Borders: subtle row separation by default; stronger group, pinned-area, editing, and total-row boundaries only where they clarify structure.
- Hover and selection: use FDS semantic interaction colours, never status colour; selected rows remain distinguishable in high contrast.
- Focus: a visible, non-colour-only FDS focus indicator appears for the current cell, header control, editor, and grid action.
- Editing: the active editor is visually distinct from focus and selection; validation errors remain visible after focus leaves the cell.
- Status: status badges always include text/icon semantics; colour alone is insufficient.

## Grid Behaviour Contract

FDS provides shared defaults and approved patterns for:

- sorting, filtering, column resizing, column order, pinning, selection, bulk actions, pagination, and horizontal scrolling;
- grouping and aggregation when the active AG Grid edition/licence supports them;
- saved views that persist only approved user-controlled grid state: column visibility/order/width, sort, filters, grouping, density, and pagination preferences;
- pinned identifiers on the left and a limited action area on the right; pinning must never consume the usable centre viewport;
- a predictable reset-to-default view and a clear indication when a saved or modified view is active.

Pagination, grouping, aggregation, and server-side data behavior are selected per workload; FDS must not hide backend/data-contract decisions behind visual props.

## Editing and Validation

- Columns are read-only unless the FDS column contract explicitly marks them editable and the user has permission.
- Use inline editors for short, low-risk values; use a popup or row/detail workflow for long, relational, date, or high-consequence input.
- Editors use FDS form controls and their labels, helper text, required state, and validation semantics where context permits.
- Validation blocks committing an invalid value, identifies the failing cell and reason, and preserves the attempted value until the user resolves or cancels it.
- Server-side save failures retain an actionable error state and never silently revert a value. Optimistic updates require an explicit recovery path.
- Keyboard flow must enter, commit, cancel, and move between editable cells without requiring a pointer.

## Shared Cell Patterns

FDS supplies reusable, documented cell contracts rather than screen-specific renderers:

| Cell | Contract |
| --- | --- |
| Status | Semantic label and optional icon; text remains visible; no colour-only meaning. |
| Currency | ISO currency plus locale-aware amount; right-aligned, tabular numerals; source and converted values are explicitly labelled. |
| Date | Unambiguous formatted date; timezone/time shown only when operationally relevant; sort on the underlying value. |
| Weight | Numeric value plus unit; unit never implied. |
| Volume | Numeric value plus unit, such as CBM; unit never implied. |
| Partner | Human-readable name, optional role/type and safe truncation; identity remains available in the row-detail path. |
| Actions | Named buttons/menus with accessible labels; destructive actions require a clear confirmation pattern. |

## Grid States

- Loading: retain the grid frame and column structure when known; use an accessible loading announcement and avoid a misleading empty state.
- Empty: state what is absent, why when known, and the next safe action (for example, clear filters or create a record).
- Error: identify the failed operation and provide retry/recovery without discarding user-applied view state.
- Permission: explain that access is restricted without exposing protected data; hide unavailable destructive/bulk actions rather than presenting a dead control.
- No-results: distinguish filtered zero results from an empty dataset and provide a reset-filter action.

## Keyboard and Accessibility

- Preserve AG Grid keyboard navigation and ARIA grid/treegrid semantics; custom cells, editors, headers, and menus must not trap focus or suppress required keys.
- Every control has an accessible name; icon-only actions require one.
- The grid must provide a visible focus location, a usable keyboard route to filters, column controls, bulk actions, editing, and pagination, and predictable Escape behavior.
- Test supported workflows with keyboard-only use and VoiceOver/NVDA or JAWS before release. Grouping, virtualisation, and server-side row models need explicit assistive-technology checks because they can affect announcements.
- Meet FDS contrast and status requirements in default, hover, selected, focused, disabled, error, and high-contrast states.

## Smaller-Screen Behaviour

`FDSDataGrid` is not a card replacement. It keeps comparison work available through progressive disclosure:

1. Each column has an FDS priority: `critical`, `standard`, or `supplementary`.
2. Keep selection/expand control, primary identifier, and essential status pinned or visible first.
3. Hide supplementary columns before standard columns; reveal them through column controls or a row-detail drawer.
4. Preserve horizontal overflow when comparison requires it, with a visible affordance and an accessible scroll path.
5. Limit pinned width so the scrollable centre remains usable; do not pin every important column.
6. Move long editing tasks to a row-detail or dialog workflow on narrow screens instead of compressing spreadsheet controls.

## Product API Direction

The `sandbox-fds-components` public surface should describe freight work, not raw theme internals:

```tsx
<FDSDataGrid
  density="compact"
  columns={shipmentColumns}
  rows={shipments}
  viewKey="ocean-export-jobs"
  onRowAction={handleRowAction}
/>
```

The exact API is not approved yet. The direction is:

- product code supplies domain data, approved FDS column definitions, view identity, and workflow callbacks;
- FDS owns the AG Grid instance configuration, theme, density mapping, standard column types, state UI, and accessibility defaults;
- escape hatches require an explicit, documented need and must not permit per-screen theme drift.

## v0.1 Scope

Approved now:

- FDS theme/defaults for AG Grid Community and React `32.3.3`.
- Compact and comfortable density with 32/36 px and 40/44 px row/header sizing.
- Sort, filter, resize, pinned identifiers, horizontal overflow, optional checkbox selection, and a selection callback.
- Accessible grid naming and loading, empty, row-count, and selection announcements.
- A bounded generic cell renderer for approved display content.

Requires a separately approved pilot:

- Pagination and explicit column visibility/order controls.
- Standard status, currency, date, weight, volume, partner, and actions cell contracts.
- Inline text/number/select editing with validation/error treatment.
- Saved-view identity, persistence ownership, permissions, and reset behavior.

Later, after pilots prove the need:

- Server-side row model policy, large-data benchmarks, and advanced cache/error recovery.
- Advanced filters, grouping, aggregation, pivoting, tree data, master/detail, and export policy.
- Rich relational/date editors, offline/conflict handling, and spreadsheet-style multi-cell editing.
- A complete mobile grid editor or a visual workflow builder.

## Open Decisions

1. Choose the saved-view persistence owner and permission model: local preference, backend user setting, or shared team view.
2. Define the server-side data contract, performance budgets, and export behavior before committing to large-dataset workflows.

## Official Implementation References

- [AG Grid compactness and row height](https://www.ag-grid.com/react-data-grid/theming-compactness/)
- [AG Grid theme parameters](https://www.ag-grid.com/react-data-grid/theming-api/)
- [AG Grid column pinning](https://www.ag-grid.com/javascript-data-grid/column-pinning/)
- [AG Grid cell editors and validation](https://www.ag-grid.com/javascript-data-grid/cell-editors/)
- [AG Grid accessibility](https://www.ag-grid.com/javascript-data-grid/accessibility/)
