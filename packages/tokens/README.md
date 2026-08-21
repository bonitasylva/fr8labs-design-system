# sandbox-fds-tokens

Framework-neutral Fr8Labs Design System CSS custom properties.

```sh
npm install sandbox-fds-components sandbox-fds-icons sandbox-fds-tokens
```

```css
@import 'sandbox-fds-tokens/tokens.css';
```

Apply the `fds-root` class to the subtree that should receive the tokens. React applications using `sandbox-fds-components/styles.css` already receive this stylesheet through the component package.

## Theme boundary

FDS ships the `default` theme. Product CSS consumes semantic tokens; it never replaces primitive or component tokens. Future tenant themes may override only the semantic color roles declared in [`theme-contract.json`](./theme-contract.json), with the listed contrast requirements. The contract deliberately does not define tenant values or a theme-provider API yet.

## Breakpoints

Import the shared page-layout thresholds when JavaScript or build tooling needs them:

```ts
import breakpoints from 'sandbox-fds-tokens/breakpoints.json';
```

These values are also emitted as functional primitive CSS tokens: `--fds-primitive-breakpoint-base`, `--fds-primitive-breakpoint-small`, `--fds-primitive-breakpoint-medium`, `--fds-primitive-breakpoint-large`, and `--fds-primitive-breakpoint-wide`.

FDS uses `40rem`, `48rem`, `64rem`, and `80rem`. The `64rem` (1024px) layout is the required compact desktop baseline; wider layouts are enhancements. In authored CSS, use the matching rem value directly because CSS custom properties are not valid in media-query conditions.

## Content widths

Breakpoints do not make content stretch to the viewport. Use the semantic container tokens for constrained content:

```css
.page-content {
  inline-size: min(100%, var(--fds-size-container-page));
  margin-inline: auto;
}

.form-content {
  inline-size: min(100%, var(--fds-size-container-form));
}
```

`--fds-size-container-reading` limits prose to `72ch`. Data tables and operational workspaces remain fluid so they can use genuinely helpful extra width.
