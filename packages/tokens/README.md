# sandbox-fds-tokens

Framework-neutral Fr8Labs Design System CSS custom properties.

```sh
npm install sandbox-fds-components@testing sandbox-fds-icons@testing sandbox-fds-tokens@testing
```

```css
@import 'sandbox-fds-tokens/tokens.css';
```

Apply the `fds-root` class to the subtree that should receive the tokens. React applications using `sandbox-fds-components/styles.css` already receive this stylesheet through the component package.

## Breakpoints

Import the shared page-layout thresholds when JavaScript or build tooling needs them:

```ts
import breakpoints from 'sandbox-fds-tokens/breakpoints.json';
```

These are primitive responsive tokens. FDS uses `40rem`, `48rem`, `64rem`, and `80rem`. The `64rem` (1024px) layout is the required compact desktop baseline; wider layouts are enhancements. In authored CSS, use the matching rem value directly because CSS custom properties are not valid in media-query conditions.

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
