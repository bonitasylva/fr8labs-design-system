# FDS engineering sandbox

Public testing mirror for FDS version `0.1.1`. This is not the final production release.

## Test the packages

```sh
npm install sandbox-fds-components@testing
```

- [`sandbox-fds-components`](https://www.npmjs.com/package/sandbox-fds-components)
- [`sandbox-fds-icons`](https://www.npmjs.com/package/sandbox-fds-icons)
- [`sandbox-fds-tokens`](https://www.npmjs.com/package/sandbox-fds-tokens)

Use the [testing Storybook](https://fr8labs-fds-storybook.vercel.app) for component documentation and examples.

## Test the MCP

Use this Streamable HTTP endpoint:

```text
https://fr8labs-fds-mcp.vercel.app/api/mcp
```

The MCP exposes nine read-only tools. Public manifests contain approved components, patterns, foundations, and getting-started documentation only. Internal and experimental Storybook entries are excluded.

To run the same MCP snapshot locally:

```sh
cd packages/components
npm install
npm run mcp
```

The local endpoint is `http://127.0.0.1:8787/mcp`.

## Repository contents

- `packages/components`: public MCP runtime, sanitized Storybook manifests, approved catalog, and package documentation.
- `packages/icons`: published testing icon package.
- `packages/tokens`: published testing token package.

Do not send customer data, credentials, shipment data, or production data through the public testing MCP.
