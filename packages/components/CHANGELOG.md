# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this package adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Promoted components and tokens 0.2.0 to the default npm channel and updated installation guidance to use tagless package names.

## [0.3.0] - 2026-08-19

### Breaking Changes

- **Tokens:** Removed duplicate CSS aliases from bundled styles. [migration: replace aliases such as `--spacing-3` with their `--fds-*` semantic equivalent]

### Changed

- Updated component styles to use canonical FDS tokens only.

## [0.2.0] - 2026-08-18

### Breaking Changes

- **InlineAlert:** Alerts are dismissible by default. Set `persistent` when a message must remain until its workflow state is resolved. [migration: add `persistent` to existing alerts that must not be dismissed]
- **Tokens:** Existing neutral, feedback, shadow, and Button token values changed. [migration: reference published semantic or component tokens instead of copied raw values]

### Added

- **Notification:** Added a floating notification component with optional title, lists, embedded links, one action, and dismissal.
- **InlineAlert:** Added `size`, `highEmphasis`, `list`, `persistent`, `dismissIconAriaLabel`, and `onDismiss` APIs.
- **Tokens:** Added exported breakpoint data and semantic form, reading, and page-width tokens.

### Changed

- Refined Button structure, status colors, alert contrast, overlay shadows, and compact responsive behavior.
- Expanded the icon catalog and refreshed Getting Started, component, icon, and token documentation.
- Licensed the package under Apache-2.0.
- Documented the complete three-package Engineering install and surfaced the MCP setup guide.

## [0.1.2] - 2026-08-18

### Fixed

- Replaced local tarball instructions with the published testing-package install command.
- Kept the stylesheet import in application setup and removed contributor-only Storybook instructions from the npm README.
- Excluded the generated MCP catalog from the npm package artifact.
- Added explicit testing-release, repository, and unlicensed metadata.

## [0.1.1] - 2026-08-17

### Added

- First approved pilot release of the `sandbox-fds-components` testing package.
- Approved DateTimePicker, FDSDataGrid, Popover, Tabs, and Tooltip documentation and package exports.
- Aligned approval metadata across the complete public component surface.
- Added the three approved fake-data workflow patterns and the read-only MCP catalog surface.
