# Component Scope v0.1

## Core Components

Target 8-12 components:

1. Button
2. Icon button
3. Text input
4. Select
5. Checkbox
6. Badge/status tag
7. `FDSDataGrid`: FDS-styled AG Grid integration for complex operational and accounting grids
8. Tabs
9. Modal/dialog
10. Drawer/side panel
11. Inline alert
12. Card/panel

All 12 slots are implemented, publicly exported, and approved. Native `Select` satisfies the selection slot, and `InlineAlert` satisfies the feedback slot. A searchable combobox or transient Toast requires a validated workflow before it enters scope.

## Freight-Specific Compositions

The approved workflow patterns are list-and-review, create/edit form, and record-detail/review. The items below remain candidate freight compositions rather than v0.1 completion requirements:

- Shipment summary header.
- Charge table.
- Approval step list.
- Document preview shell.
- Filter bar.
- Status timeline.

## API Direction

FDS UI components should expose product-friendly props and hide implementation choices:

- `status="approved"` instead of raw colors.
- `density="compact"` for ERP tables and forms.
- `tone="danger"` for destructive actions.
- `currency`, `amount`, and `align="numeric"` for finance cells where needed.

## Table Engine Boundary

- Use native FDS composition for simple, non-interactive tables.
- Use AG Grid behind `FDSDataGrid` for complex, high-density operational and accounting grids.
- The approved `FDSDataGrid` slice owns shared tokens, density, row/header sizing, sort/filter/resize, pinned identifiers, selection, loading/empty states, and accessibility defaults. Editing, specialised cell contracts, pagination, and saved views require a separately approved pilot. Product screens must not style or configure AG Grid independently.

Testing examples import these components from `sandbox-fds-components`.

## Exclusions For v0.1

- Full chart system.
- Drag-and-drop workflow builders.
- Custom date picker unless native/input-based options fail.
- Full WYSIWYG document editor.
- Custom table virtualization beyond AG Grid.
- Complete mobile app design system.

## Acceptance For v0.1 Scope

A component belongs in v0.1 only if it appears in at least one pilot prototype or blocks migration from a repeated legacy pattern.
