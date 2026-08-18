# Component Scope

The current public surface is `sandbox-fds-components` v0.2.0. It supersedes the initial v0.1 planning target of 8–12 components.

## Public Components

- Actions: `Button`, `IconButton`, `ActionGroup`
- Inputs: `TextInput`, `Textarea`, `DateTimePicker`, `Select`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`
- Feedback: `StatusBadge`, `InlineAlert`, `Notification`, `EmptyState`
- Data display: `Metric`, `Avatar`, `DataTable`, `FDSDataGrid`, `InlineInput`
- Navigation: `Pagination`, `Tabs`
- Layout: `PageHeader`, `FilterBar`, `Panel`
- Overlays: `Dialog`, `Drawer`, `Tooltip`, `Popover`

All 30 components are publicly exported and documented in Storybook. `FdsProvider` is the package setup API rather than a catalog component. A searchable combobox, menu, or additional feedback primitive requires a validated workflow before it enters scope.

## Freight-Specific Compositions

The approved workflow patterns are list-and-review, create/edit form, and record-detail/review. The items below remain candidate freight compositions rather than current completion requirements:

- Shipment summary header.
- Charge table.
- Approval step list.
- Document preview shell.
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

Examples import these components from `sandbox-fds-components`.

## Current Exclusions

- Full chart system.
- Drag-and-drop workflow builders.
- A custom calendar picker beyond the current native/input-based `DateTimePicker`.
- Full WYSIWYG document editor.
- Custom table virtualization beyond AG Grid.
- Complete mobile app design system.

## Acceptance For New Components

A new component enters the public scope only when it solves a repeated product workflow that cannot be covered safely by an existing component, composition, or native browser control. It must also ship with a documented API, accessibility behavior, Storybook examples, and verification.
