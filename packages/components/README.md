# sandbox-fds-components

Pre-1.0 release of Fr8Labs Design System (FDS) components for browser-based React applications. This package supports the approved component surface in Vite applications; it does not support Node rendering or SSR.

## Requirements

- React and React DOM 19 or later.
- AG Grid Community and React `32.3.3`. Enterprise licensing remains application-owned.
- A browser application built with Vite.

## Installation

```sh
npm install sandbox-fds-components sandbox-fds-icons sandbox-fds-tokens
```

Install all three packages so the application can consume components, icons, and framework-neutral tokens through their public package APIs.

## Setup

```tsx
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Button, FdsProvider, Panel} from 'sandbox-fds-components';
import 'sandbox-fds-components/styles.css';

function App() {
  return (
    <FdsProvider>
      <Panel>
        <Button>Save shipment</Button>
      </Panel>
    </FdsProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
```

`FdsProvider` is package setup: it scopes FDS styles and the default theme to its subtree. It remains documented here rather than appearing as a catalog component.

Import `sandbox-fds-components/styles.css` once in the application entry point. It includes the FDS tokens and icon styles. IBM Plex Sans Condensed is bundled under the SIL Open Font License; Material Symbols Sharp currently loads from Google Fonts.

Import only from `sandbox-fds-components` during Engineering testing. Components are Fr8Labs-owned native React and CSS; consumers do not need MUI, Tailwind, shadcn, or another UI runtime.

## Documentation

Use the [hosted Storybook](https://fr8labs-fds-storybook.vercel.app/) for component guidance, examples, and release notes.

## Button

`Button` uses one action shape with native button semantics.

- `tone` is `primary` (default), `secondary`, `tertiary`, or `danger`. Use one primary action per action area; use tertiary for low-emphasis actions such as clearing filters.
- `size` is `small` (28px) for dense toolbars and tables, `medium` (32px, default) for forms and standalone actions, or `large` (40px) for prominent page-level actions. Do not mix sizes within one button group.
- `loading` disables interaction while preserving the button’s accessible name. `disabled`, `startIcon`, and `endIcon` are supported.
- Standard native button props—including `type`, form attributes, event handlers, `data-*`, and ARIA attributes—are forwarded.

## IconButton

`IconButton` is for a familiar icon whose action remains clear without visible text. Import `Icon` from `sandbox-fds-icons` and always supply `aria-label` or `aria-labelledby` on the button.

- Its required children are decorative icon content. `size` and `tone` follow Button: 28px, 32px, or 40px; `tertiary` is the default tone.
- `loading` blocks repeat activation while preserving focus and the accessible name. `disabled`, native button events/attributes, and flat-object `sx` are supported. FDS applies layout/state styles first, then `sx`, then native `style`.
- MUI-specific polymorphism, `edge`, ripple controls, and theme, responsive, or nested `sx` values are not supported.

## ActionGroup

`ActionGroup` arranges related, independent actions with consistent spacing, wrapping, and start or end alignment. Place supporting actions first and no more than one primary action last. It does not join buttons, manage selection, open menus, or add composite keyboard behavior.

## Tabs

`Tabs` switches between related panels without changing the URL. Keep labels short, provide a specific `ariaLabel`, and use unique item values; selection is controlled by `value` and `onChange`. The initial horizontal slice activates immediate local panels on focus and supports Left/Right, Home, and End keys with wrapping.

## Dialog, Drawer, Tooltip, and Popover

`Dialog` owns a controlled native modal with a visible title and close control, focus containment, Escape and backdrop dismissal, and trigger-focus restoration. Set `dismissOnBackdrop={false}` when an outside click could discard unsaved work; use `role="alertdialog"` only for urgent confirmations and place the safest enabled footer action first so it receives initial focus.

`Drawer` uses the same modal contract as a right-side sheet. It is 540px wide on regular viewports and edge-to-edge at 768px and below. Keep drawer tasks short and single-column; use a page for long or multi-step work.

`Tooltip` adds brief, non-interactive supporting text to a focusable trigger. `Popover` opens a non-modal interactive panel with a visible title, close control, light-dismiss, and focus restoration. Use a menu pattern—not Popover—for a list of actions.

## Public components

- Actions: `Button`, `IconButton`, `ActionGroup`
- Inputs: `TextInput`, `Textarea`, `DateTimePicker`, `Select`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`
- Feedback: `StatusBadge`, `InlineAlert`, `Notification`, `EmptyState`
- Data display: `Metric`, `Avatar`, `DataTable`, `FDSDataGrid`, `InlineInput`
- Navigation: `Pagination`, `Tabs`
- Layout: `PageHeader`, `FilterBar`, `Panel`
- Overlays: `Dialog`, `Drawer`, `Tooltip`, `Popover`

The package also exports the documented component prop and support types: `ButtonProps`, `ButtonSize`, `ButtonTone`, `IconButtonProps`, `IconButtonSize`, `IconButtonSx`, `IconButtonTone`, `TextInputProps`, `TextareaProps`, `DateTimePickerProps`, `DateTimeRangeValue`, `Status`, `StatusBadgeProps`, `SelectOption`, `SelectProps`, `CheckboxProps`, `CheckboxOption`, `CheckboxGroupProps`, `RadioProps`, `RadioOption`, `RadioGroupProps`, `SwitchProps`, `AvatarProps`, `PanelProps`, `EmptyStateProps`, `PaginationProps`, `TabsItem`, `TabsProps`, `ActionGroupProps`, `PageHeaderProps`, `FilterBarProps`, `DialogProps`, `DrawerProps`, `TooltipProps`, `PopoverProps`, `InlineAlertProps`, `InlineAlertSize`, `InlineAlertTone`, `NotificationProps`, `InlineInputDensity`, `InlineInputProps`, `MetricChange`, `MetricProps`, `DataTableAlignment`, `DataTableColumn`, `DataTableColumnWidth`, `DataTableEmptyState`, and `DataTableProps`.

`DataTable` is for simple, non-interactive tables, summaries, and short read-only lists. `FDSDataGrid` is the bounded AG Grid `32.3.3` pilot for complex operational lists: it owns FDS density and theme, pinned identifiers, sort/filter/resize, optional checkbox selection, and loading/empty states. Enterprise features, editing, saved views, export, and server-side row models remain application decisions or later pilot work. The public grid types are `FDSDataGridProps`, `FDSDataGridColumn`, `FDSDataGridDensity`, `FDSDataGridAlignment`, and `FDSDataGridEmptyState`.

`InlineInput` is the compact editor for one value inside an application-owned table cell. Use `TextInput` for labeled forms. `InlineInput` does not make `DataTable` or `FDSDataGrid` editable.

## Accessibility

Use semantic labels, visible text, and keyboard-operable controls. Supply `aria-label` when a Button’s visible children are not text, supply `ariaLabel` to `DataTable`, preserve focus behavior when opening overlays, and validate product workflows with keyboard and assistive technology before release.

## Support and rollback

The current pre-1.0 package supports browser/Vite React 19 applications only. Node rendering and SSR are unsupported. To roll back, run `npm uninstall sandbox-fds-components`, remove the FDS CSS import and provider, and restore the previous UI dependency/version in the consuming application.
