# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Product designers and frontend engineers building Fr8Labs freight workflows. Designers use FDS to choose established interface decisions; engineers use its packages and Storybook guidance to implement them consistently.

## Product Purpose

Fr8Labs Design System (FDS) provides a shared UI foundation for consistent, accessible, and audit-friendly freight products. Success means teams can install the supported packages, find the right component or foundation, and assemble workflows without rebuilding common controls, states, or interaction rules.

## Positioning

FDS combines Fr8Labs-owned React components, framework-neutral tokens, icons, freight-workflow examples, Storybook documentation, and a read-only MCP catalog. It packages both UI primitives and freight-specific workflow decisions.

## Operating Context

FDS is evaluated and used through Storybook and consumed in browser-based React applications. Its documentation must support a clear journey: install the packages, browse the component catalog, then understand the system's foundations and working method.

## Capabilities and Constraints

- Public testing packages: `sandbox-fds-components`, `sandbox-fds-icons`, and `sandbox-fds-tokens`.
- Components support React 19 browser applications built with Vite; Node rendering and SSR are unsupported.
- Consumers import FDS styles once and scope components with `FdsProvider`.
- Components are Fr8Labs-owned React and CSS with no consumer MUI, Tailwind, or shadcn runtime.
- Package versions are pre-1.0 testing releases and remain release information rather than the Welcome page's primary message.

## Evidence on Hand

The repository contains package READMEs, installation guidance, component and foundation stories, freight-workflow examples using synthetic data, changelogs, and the hosted read-only MCP contract. Future work must not invent customers, production usage, performance claims, or release guarantees.

## Product Principles

- Lead newcomers from installation to component discovery to system understanding.
- Reuse documented decisions before creating new variants or patterns.
- Explain design intent and engineering usage together.
- Validate responsive behavior, keyboard paths, accessible names, and workflow meaning before release.

## Accessibility & Inclusion

FDS guidance and components must preserve semantic HTML, visible labels, keyboard operation, accessible names, focus behavior, and meaning that does not depend on color alone.
